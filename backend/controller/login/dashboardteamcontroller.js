const Salaryslab = require("../../model/modules/setup/SalarySlabModel");
const Applyleave = require("../../model/modules/leave/applyleave");
const RevenueAmount = require("../../model/modules/production/RevenueAmountModel");
const { format } = require("date-fns");
const ClientUserid = require("../../model/modules/production/ClientUserIDModel");
const User = require("../../model/login/auth");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const bcrypt = require("bcryptjs");
const sendToken = require("../../utils/jwttokentocookie");
const checksendToken = require("../../utils/checkjson");
const sendEmail = require("../../utils/pwdresetmail");
const ProcessTeam = require("../../model/modules/production/ProcessTeamModel");
const Targetpoints = require("../../model/modules/production/targetpoints");
const Noticeperiod = require("../../model/modules/recruitment/noticeperiodapply");
const AssignBranch = require("../../model/modules/assignbranch");
const AutoLogout = require("../../model/modules/settings/autologout");
const { ObjectId } = require("mongodb");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
const Maintenance = require("../../model/modules/account/maintenance");
const TaskMaintenanceForUser = require("../../model/modules/account/taskmaintenanceforuser");
const crypto = require("crypto");
const qrcode = require("qrcode");
// const moment = require("moment");
const moment = require('moment-timezone');
const { authenticator } = require("otplib");
const Token = require("../../model/login/token");
const sendVerificationEmail = require("./sendEmail");
const AdminOverAllSettings = require("../../model/modules/settings/AdminOverAllSettingsModel");
const IndividualSettings = require("../../model/modules/settings/IndividualSettingsModel");
const ClockinIP = require("../../model/modules/settings/clockinipModel");
const ControlCriteria = require("../../model/modules/settings/Attendancecontrolcriteria");
const Shift = require("../../model/modules/shift");
const Attendance = require("../../model/modules/attendance/attendance");
const DepartmentMonth = require("../../model/modules/departmentmonthset");
const ApplyLeave = require("../../model/modules/leave/applyleave");
const Holiday = require("../../model/modules/setup/holidayModel");
const Hirerarchi = require("../../model/modules/setup/hierarchy");
const Designation = require("../../model/modules/designation");
const Leavetype = require("../../model/modules/leave/leavetype");
const EmployeeDocuments = require("../../model/login/employeedocuments");
const MyCheckList = require("../../model/modules/interview/Myinterviewchecklist");
const Company = require("../../model/modules/setup/company");
const workStation = require("../../model/modules/workstationmodel");
const Branch = require("../../model/modules/branch");
const Unit = require("../../model/modules/unit");
const faceapi = require("face-api.js");
const ShiftGrouping = require("../../model/modules/shiftgrouping");
const Leavecriteria = require("../../model/modules/leave/leavecriteria");
const ScheduleEvents = require("../../model/modules/setup/eventsModel");
const Addcandidate = require("../../model/modules/recruitment/addcandidate");
const ScheduleMeeting = require("../../model/modules/setup/schedulemeeting");
const Teams = require("../../model/modules/teams");
const Advance = require('../../model/modules/advance');
const Loan = require('../../model/modules/loan');
const LeaveVerification = require("../../model/modules/leave/leaveverification");
const Permission = require('../../model/modules/permission/permission');
const MinimumPoints = require('../../model/modules/production/minimumpoints');
const Department = require('../../model/modules/department');
const SalarySlabs = require('../../model/modules/setup/SalarySlabModel');
const ShortageMaster = require('../../model/modules/production/Shortagemaster');
const AcPointVal = require('../../model/modules/production/acpointscalculation');
const ProductionDay = require('../../model/modules/production/productionday');
const DayPointsUploadTemp = require('../../model/modules/production/daypointsuploadtemp');
const ProductionUpload = require('../../model/modules/production/productionupload');
const ProducionIndividual = require('../../model/modules/production/productionindividual');
const ProductionDayList = require('../../model/modules/production/productiondaylist');
const DayPointsUpload = require('../../model/modules/production/dayPointsUpload');
const TempPointsUpload = require("../../model/modules/production/daypointsuploadtemp");
const TaskForUser = require("../../model/modules/task/taskforuser");
const ClientUserID = require("../../model/modules/production/ClientUserIDModel");
const Raiseticketmaster = require("../../model/modules/tickets/raiseticketmaster");
const Templatelist = require('../../model/modules/settings/Templatelist');
const { v4: uuidv4 } = require('uuid');


const currentDateAttStatus = new Date();
const formatDateRemove = (inputDate) => {
  if (!inputDate) {
    return "";
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [day, month, year] = inputDate?.split("-");

  return `${day}/${month}/${year}`;
};

// Compare manual date with with formattedDate
const formatDate = (inputDate) => {
  if (!inputDate) {
    return "";
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [day, month, year] = inputDate?.split("/");

  // Use padStart to add leading zeros
  const formattedDay = String(day)?.padStart(2, "0");
  const formattedMonth = String(month)?.padStart(2, "0");

  return `${formattedDay}/${formattedMonth}/${year}`;
};

// Att Month Status
const formatDateLeaveDate = (inputDate) => {
  if (!inputDate) {
    return "";
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [year, month, day] = inputDate?.split("-");
  return `${day}-${month}-${year}`;
};

// Compare manual date with with formattedDate
const formatDateForShiftDate = (inputDate) => {
  if (!inputDate) {
    return "";
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [day, month, year] = inputDate?.split("/");
  // Use padStart to add leading zeros
  const formattedDay = String(day)?.padStart(2, "0");
  const formattedMonth = String(month)?.padStart(2, "0");
  return `${formattedDay}-${formattedMonth}-${year}`;
};

// Compare approved adjdate with formattedDate
const formatAdjDate = (inputDate) => {
  if (!inputDate) {
    return "";
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [day, month, year] = inputDate?.split("/");
  return `${day}-${month}-${year}`;
};

const parseTime = (timeString) => {
  if (!timeString) {
    return "";
  }

  // Check if the timeString contains a space
  const hasSpace = timeString?.includes(" ");

  // Split based on whether there's a space or not
  const [time, period] = hasSpace ? timeString?.split(" ") : [timeString?.slice(0, -2), timeString?.slice(-2)];

  const [hours, minutes, seconds] = time?.split(":");

  let parsedHours = parseInt(hours, 10);

  if (period === "PM" && parsedHours !== 12 && period === "pm" && parsedHours !== 12) {
    parsedHours += 12;
  } else if (period === "AM" && parsedHours === 12 && period === "am" && parsedHours === 12) {
    parsedHours = 0;
  }

  // if ((period === 'PM' && parsedHours !== 12) || (period === 'pm' && parsedHours !== 12)) {
  //     parsedHours += 12;
  // }
  // else if ((period === 'AM' && parsedHours === 12) || (period === 'am' && parsedHours === 12)) {
  //     parsedHours = 0;
  // }

  if ((period === "PM" || period === "pm") && parsedHours !== 12) {
    parsedHours += 12;
  } else if ((period === "AM" || period === "am") && parsedHours === 12) {
    parsedHours = 0;
  }

  return new Date(2000, 0, 1, parsedHours, parseInt(minutes, 10), parseInt(seconds || 0, 10));
};

const getShiftForDateAttMonthStatus = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment, matchingRemovedItem, matchingAssignShiftItem) => {
  //if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
  // return 'Pending...'
  // }
  // else
  if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "WeekOff Adjustment") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Adjustment") {
    if (matchingAssignShiftItem && matchingDoubleShiftItem?._doc?.todate === matchingAssignShiftItem?._doc?.adjdate) {
      return `${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    } else {
      return "Not Allotted";
    }
  } else if (matchingRemovedItem && matchingRemovedItem?._doc?.adjstatus === "Not Allotted") {
    return "Not Allotted";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Approved") {
    if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === "Shift Adjustment" || matchingItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
      if (column.shiftMode === "Main Shift") {
        return `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
      } else if (column.shiftMode === "Second Shift") {
        return `${matchingItem?._doc?.pluseshift.split(" - ")[0]}to${matchingItem?._doc?.pluseshift.split(" - ")[1]}`;
      }
    } else {
      return isWeekOffWithAdjustment ? `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}` : `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    }
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
    return isWeekOffWithManual ? `${matchingItemAllot._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} ` : `${matchingItemAllot?._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `;
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
    return "Week Off";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Reject" && isWeekOff) {
    // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    return "Week Off";
  }
  // else if (boardingLog?.length > 0) {
  //     if (!recentShiftTimingDate) {
  //         return ""
  //     }
  //     // const [year, month, day] = recentShiftTimingDate?.split('-');
  //     // // Map through each column and compare dates
  //     // const shifts = tempResultDates?.map((currentColumn) => {
  //     //     const [day1, month1, year1] = currentColumn.formattedDate?.split('-');
  //     //     if (year >= year1 && month >= month1 && day >= day1) {
  //     //         return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "Week Off");
  //     //     }
  //     //     else {
  //     //         return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "Week Off");
  //     //     }
  //     // });
  //     const shifts = tempResultDates?.map((currentColumn) => {
  //         if (!recentShiftTimingDate) {
  //             return ""
  //         }
  //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
  //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`) + 1;
  //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
  //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`) + 1;

  //         if (shiftFormattedDate >= columnFormattedDate) {
  //             return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "Week Off");
  //         } else {
  //             return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "Week Off");
  //         }
  //     });

  //     // Return the shift value for the current column
  //     return shifts[dayCount - 1];

  // }
  // else if (boardingLog?.length > 0) {
  //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
  //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

  //     // Filter boardingLog entries for the same start date
  //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

  //     // If there are entries for the date, return the shift timing of the second entry
  //     if (entriesForDate.length > 1) {
  //         return entriesForDate[1].shifttiming;
  //     }

  //     // Find the most recent boarding log entry that is less than or equal to the selected date
  //     const recentLogEntry = boardingLog
  //         .filter(log => log.startdate <= finalDate)
  //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

  //     // If a recent log entry is found, return its shift timing
  //     if (recentLogEntry) {
  //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
  //     } else {
  //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
  //         return !isWeekOff ? actualShiftTiming : "Week Off";
  //     }
  // }
  else if (boardingLog.length > 0) {
    // Remove duplicate entries with recent entry
    const uniqueEntries = {};
    boardingLog.forEach((entry) => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date
    const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

    if (relevantLogEntry) {
      // Daily
      if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "Daily") {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      // 2 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "1 Week Rotation") {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

        // Calculate the day count until the next Sunday
        let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number
        const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === "2 Week Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        const currentDate = new Date(finalDate);

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        // Calculate total days for 1-month rotation based on the effective month
        let totalDays = monthLengths[effectiveMonth];

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          // Set startDate to the next matchingDepartment.fromdate for each cycle
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = monthLengths[effectiveMonth];

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
        }

        // Calculate the difference in days correctly
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

        // Calculate the week number within the rotation month based on 7-day intervals from start date
        // const weekNumber = Math.ceil(diffDays / 7);
        let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

        const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];
        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota updated
      if (relevantLogEntry.shifttype === "1 Month Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Calculate month lengths with leap year check for a given year
        const calculateMonthLengths = (year) => {
          return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        };

        // Determine the effective month and year for the start date
        let effectiveMonth = startDate.getMonth();
        let effectiveYear = startDate.getFullYear();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
          if (effectiveMonth === 0) {
            effectiveYear += 1; // Move to the next year if month resets
          }
        }

        // Calculate total days for the current two-month cycle
        let totalDays = 0;
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
          const currentYear = effectiveYear + yearAdjustment;
          const monthLengthsForYear = calculateMonthLengths(currentYear);
          totalDays += monthLengthsForYear[monthIndex];
        }

        // Set the endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

        // Recalculate if currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month and year for the next cycle
          effectiveMonth = startDate.getMonth();
          effectiveYear = startDate.getFullYear();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
            if (effectiveMonth === 0) {
              effectiveYear += 1;
            }
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
            const currentYear = effectiveYear + yearAdjustment;
            const monthLengthsForYear = calculateMonthLengths(currentYear);
            totalDays += monthLengthsForYear[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
        }
        // Calculate the difference in days including the start date
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
        let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

        // Define week names for first and second month of the cycle
        const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

        const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }
        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
};

const getWeekOffDay = (column, boardingLog, department, overAllDepartment) => {
  if (boardingLog.length > 0) {
    // Remove duplicate entries with recent entry
    const uniqueEntries = {};
    boardingLog.forEach((entry) => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date
    const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

    if (relevantLogEntry) {
      // Daily
      if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "Daily") {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      // 2 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "1 Week Rotation") {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

        // Calculate the day count until the next Sunday
        let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number
        const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === "2 Week Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        const currentDate = new Date(finalDate);

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        // Calculate total days for 1-month rotation based on the effective month
        let totalDays = monthLengths[effectiveMonth];

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          // Set startDate to the next matchingDepartment.fromdate for each cycle
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = monthLengths[effectiveMonth];

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
        }

        // Calculate the difference in days correctly
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

        // Calculate the week number within the rotation month based on 7-day intervals from start date
        // const weekNumber = Math.ceil(diffDays / 7);
        let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

        const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];
        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota updated
      if (relevantLogEntry.shifttype === "1 Month Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Calculate month lengths with leap year check for a given year
        const calculateMonthLengths = (year) => {
          return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        };

        // Determine the effective month and year for the start date
        let effectiveMonth = startDate.getMonth();
        let effectiveYear = startDate.getFullYear();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
          if (effectiveMonth === 0) {
            effectiveYear += 1; // Move to the next year if month resets
          }
        }

        // Calculate total days for the current two-month cycle
        let totalDays = 0;
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
          const currentYear = effectiveYear + yearAdjustment;
          const monthLengthsForYear = calculateMonthLengths(currentYear);
          totalDays += monthLengthsForYear[monthIndex];
        }

        // Set the endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

        // Recalculate if currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month and year for the next cycle
          effectiveMonth = startDate.getMonth();
          effectiveYear = startDate.getFullYear();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
            if (effectiveMonth === 0) {
              effectiveYear += 1;
            }
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
            const currentYear = effectiveYear + yearAdjustment;
            const monthLengthsForYear = calculateMonthLengths(currentYear);
            totalDays += monthLengthsForYear[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
        }
        // Calculate the difference in days including the start date
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
        let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

        // Define week names for first and second month of the cycle
        const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

        const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
};

// get total days of current month
const getTotalMonthDays = (rowdepartment, depMonthSet, ismonth, isyear) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const totalDaysInMonth = new Date(isyear, ismonth, 0).getDate();
  // const depdays = depMonthSet && depMonthSet?.find((d) => d.department === rowdepartment && Number(d.month) === ismonth && Number(d.year) === isyear);
  const depdays = depMonthSet && depMonthSet?.find((d) => d.department === rowdepartment && d.monthname === monthNames[ismonth - 1] && Number(d.year) === isyear);
  if (depdays) {
    return depdays.totaldays;
  }
  return totalDaysInMonth;
};

// get total week off count
const getTotalWeekOff = (rowempcode, usershift) => {
  let totalWeekOffDaysCount = 0;
  const totalWeekOffDays = usershift && usershift?.filter((d) => d.empCode === rowempcode && d.shiftlabel === "Week Off");
  if (totalWeekOffDays) {
    totalWeekOffDays.forEach((wkoff) => {
      totalWeekOffDaysCount++;
    });
  }
  return totalWeekOffDaysCount;
};

// get total holidays count based on the matched branch
const getTotalHolidays = (rowcompany, rowbranch, rowunit, rowteam, rowcompanyname, tempResultDates, holidays) => {
  let totalHolidayCount = 0;
  const totalHoliDays = holidays?.filter((d) => d.company?.includes(rowcompany) && d.applicablefor?.includes(rowbranch) && d.unit?.includes(rowunit) && d.team?.includes(rowteam) && d.employee?.includes(rowcompanyname));
  if (totalHoliDays) {
    tempResultDates &&
      tempResultDates?.forEach((date) => {
        totalHoliDays.forEach((holi) => {
          if (formatDateLeaveDate(holi.date) === date.formattedDate) {
            totalHolidayCount += Number(holi.noofdays);
          }
        });
      });
  }
  return totalHolidayCount;
};


// Shift Roaster functions
// Get Clock in time for the user
const checkGetClockInTime = (attendance, rowuserid, rowdate, rowshift, rowshiftmode) => {
  const attendanceRecord = attendance?.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  if (attendanceRecord) {
    return attendanceRecord.clockintime !== "" ? (rowshift === "Week Off" ? "00:00:00" : attendanceRecord.clockintime) : "00:00:00";
  }
  // Return a default value if clockin time is not available
  return "00:00:00";
};

// Get Clock out time for the user
const checkGetClockOutTime = (attendance, rowuserid, rowdate, rowshift, rowshiftmode) => {
  const attendanceRecord = attendance.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  if (attendanceRecord) {
    return attendanceRecord.clockouttime !== "" ? (rowshift === "Week Off" ? "00:00:00" : attendanceRecord.clockouttime) : "00:00:00";
  }
  // Return a default value if clockin time is not available
  return "00:00:00";
};
// Get Clock in date for the user
const checkGetClockInDate = (attendance, rowuserid, rowdate, rowshiftmode) => {
  const attendanceRecord = attendance?.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  if (attendanceRecord) {
    return attendanceRecord.date;
  }
  // Return a default value if clockin date is not available
  return "";
};

const checkGetClockInAutoStatus = (attendance, rowuserid, rowdate, rowshiftmode) => {
  const attendanceRecord = attendance?.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  if (attendanceRecord) {
    return attendanceRecord.autoclockout;
  }
  // Return a default value if clockin date is not available
  return "";
};

const getUserIp = (attendance, rowuserid, rowdate, rowshiftmode) => {
  // Find the attendance record for the given user id and date
  const attendanceRecord = attendance.find((record) => record.userid === rowuserid && formatDateRemove(record.date) === rowdate && record.shiftmode === rowshiftmode);

  if (attendanceRecord) {
    return attendanceRecord.clockinipaddress;
  }

  // Return an empty string if no attendance record is found
  return "";
};

const checkClockInStatus = (
  clockintime,
  rowshift,
  graceTime,
  allLeaveStatus,
  holidays,
  clockindate,
  rowbranch,
  rowempcode,
  rowcompany,
  rowformattedDate,
  rowunit,
  rowteam,
  rowcompanyname,
  earlyClockInTime,
  lateClockInTime,
  afterLateClockInTime,
  leavetype,
  permission,
  clockouttime,
  rowshiftmode,
  weekoffpresentstatus,
  leavecriterias ,
  weekNumberInMonth,
  dayName,
  rowdepartment,
  rowdesignation
) => {
  const totalFinalLeaveDaysApproved = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");
  const totalFinalLeaveDaysApprvedAndApplied = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");

  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "");

  const totalPermissionApprovedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "Compensation");

  const holidayResults = holidays.filter((item) => moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY") === rowformattedDate);
  const isHoliday = holidayResults?.some((holiday) => (holiday.company?.includes(rowcompany) && holiday.applicablefor?.includes(rowbranch) && holiday.unit?.includes(rowunit) && holiday.team?.includes(rowteam) && holiday.employee.includes("ALL") ? rowcompanyname : holiday.employee?.includes(rowcompanyname)));

  let leavestatusApproved = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApproved &&
      totalFinalLeaveDaysApproved.forEach((d) => {
        if (type.leavetype === d.leavetype) {
          d.usershifts.forEach((shift) => {
            leavestatusApproved.push({
              date: shift.formattedDate,
              shiftmode: shift.shiftmode,
              leavetype: d.leavetype,
              status: d.status,
              code: type.code,
              tookleavecheckstatus: shift.tookleavecheckstatus,
              leavestatus: shift.leavestatus,
              shiftcount: shift.shiftcount,
            });
          });
        }
      });
  });

  let leaveWithoutApproved = [];

  totalFinalLeaveDaysApproved &&
    totalFinalLeaveDaysApproved.forEach((d) => {
      if (d.leavetype === "Leave Without Pay (LWP)") {
        d.usershifts.forEach((shift) => {
          leaveWithoutApproved.push({
            date: shift.formattedDate,
            shiftmode: shift.shiftmode,
            leavetype: d.leavetype,
            status: d.status,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        });
      }
    });

  const leaveOnDateApprovedSingleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveOnDateApprovedSingleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedSingleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveOnDateApprovedDoubleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveOnDateApprovedDoubleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedDoubleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveOnDateApprovedDoubleDayFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveOnDateApprovedDoubleDayHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedDoubleDayHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedSingleFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedSingleHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedSingleHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedDoubleFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedDoubleHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedDoubleHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedDoubleDayFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedDoubleDayHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedDoubleDayHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [columnDay, columnMonth, columnYear] = rowformattedDate?.split("/");
  const monthname = monthNames[columnMonth - 1];

  let isRemovedLeaveData = [];
  totalFinalLeaveDaysApprvedAndApplied.map((data) => {
    if (data.date?.includes(rowformattedDate)) {
      isRemovedLeaveData.push(rowformattedDate);
    }
  });

  const resemp = leavecriterias.filter((data) => data.mode === "Employee");
  const resdes = leavecriterias.filter((data) => data.mode === "Designation");
  const resdpt = leavecriterias.filter((data) => data.mode === "Department");

  let resultemp = resemp.find((d) => d.company?.includes(rowcompany) && d.branch?.includes(rowbranch) && d.unit?.includes(rowunit) && d.team?.includes(rowteam) && d.employee?.includes(rowcompanyname) && d.leavetype === "No Call/No Show");
  let resultdesg = resdes.find((d) => d.designation?.includes(rowdesignation) && d.leavetype === "No Call/No Show");
  let resultdept = resdpt.find((d) => d.department?.includes(rowdepartment) && d.leavetype === "No Call/No Show");

  let filteredresultemp = resemp.filter((d) => d.company?.includes(rowcompany) && d.branch?.includes(rowbranch) && d.unit?.includes(rowunit) && d.team?.includes(rowteam) && d.employee?.includes(rowcompanyname) && d.leavetype === "No Call/No Show");
  let filteredresultdesg = resdes.filter((d) => d.designation?.includes(rowdesignation) && d.leavetype === "No Call/No Show");
  let filteredresultdept = resdpt.filter((d) => d.department?.includes(rowdepartment) && d.leavetype === "No Call/No Show");

  let finalleavecriterias = resultemp ? filteredresultemp : resultdesg ? filteredresultdesg : resultdept ? filteredresultdept : [];

  let isBlockDaysMatch = [];
  finalleavecriterias.flat()?.find((d) => {
    d.tookleave.forEach((val) => {
      if (val.year === columnYear && val.month === monthname && val.week === weekNumberInMonth && val.day === dayName && clockintime === "00:00:00" && rowshift !== "Week Off") {
        isBlockDaysMatch.push(rowformattedDate);
      }
    });
  });
  const uniqueIsBlockDaysDate = [...new Set(isBlockDaysMatch)];

  let finalData = [];
  if (isRemovedLeaveData.length > 0) {
    finalData = uniqueIsBlockDaysDate.filter((data) => !isRemovedLeaveData.includes(data));
  } else {
    finalData = [...uniqueIsBlockDaysDate];
  }

  if (finalData?.includes(rowformattedDate) && clockintime === "00:00:00" && rowshift !== "Week Off" && new Date(`${columnYear}-${columnMonth}-${columnDay}`) < new Date()) {
    return `BL - Absent`;
  }

  if (leaveWithoutOnDateApprovedSingleFL) {
    return `LWP ${leaveWithoutOnDateApprovedSingleFL.status}`;
  } else if (leaveWithoutOnDateApprovedSingleHB) {
    return `HB - LWP ${leaveWithoutOnDateApprovedSingleHB.status}`;
  } else if (leaveWithoutOnDateApprovedSingleHA) {
    return `HA - LWP ${leaveWithoutOnDateApprovedSingleHA.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleFL) {
    return `DL - LWP ${leaveWithoutOnDateApprovedDoubleFL.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleHB) {
    return `DHB - LWP ${leaveWithoutOnDateApprovedDoubleHB.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleHA) {
    return `DHA - LWP ${leaveWithoutOnDateApprovedDoubleHA.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayFL) {
    return `DDL - LWP ${leaveWithoutOnDateApprovedDoubleDayFL.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayHB) {
    return `DDHB - LWP ${leaveWithoutOnDateApprovedDoubleDayHB.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayHA) {
    return `DDHA - LWP ${leaveWithoutOnDateApprovedDoubleDayHA.status}`;
  }

  const isStartShiftPerm = permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode && d.applytype === "startshift");
  const isCompPerm = totalPermissionApprovedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode);

  let clockInTime = parseTime(clockintime);

  const actualStartTime = parseTime(rowshift?.split("to")[0]);
  if (!actualStartTime) {
    return rowshift === "Not Allotted" ? "Not Allotted" : rowshift === "Week Off" && clockintime === "00:00:00" ? "Week Off" : "Invalid start time";
  }

  // normal permission
  const permTimeInMilliseconds = (isStartShiftPerm && isStartShiftPerm.requesthours) * 60000;
  const startTimeWithPerm = new Date(actualStartTime?.getTime() + permTimeInMilliseconds);
  if (isStartShiftPerm && clockInTime >= actualStartTime && clockInTime <= startTimeWithPerm) {
    return "PERAPPR - IN";
  }

  // (perm applytype === 'startshift' or 'inbetween') and comp applytype = 'startshift'
  const compStart_StartPermTimeInMilliseconds = (isCompPerm && isCompPerm.requesthours) * 60000;
  const compStartTimeWithPermStart = new Date(actualStartTime?.getTime() - compStart_StartPermTimeInMilliseconds);
  if (isCompPerm && (isCompPerm.applytype === "startshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "startshift" && clockInTime >= compStartTimeWithPermStart && clockInTime <= actualStartTime) {
    return "COMP - PERAPPRIN";
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  const compStart_EndPermTimeInMilliseconds = (isCompPerm && isCompPerm.requesthours) * 60000;
  const compEndTimeWithPermStart = new Date(actualStartTime?.getTime() + compStart_EndPermTimeInMilliseconds);
  if (isCompPerm && isCompPerm.applytype === "startshift" && isCompPerm.compensationapplytype === "endshift" && clockInTime >= actualStartTime && clockInTime <= compEndTimeWithPermStart) {
    return "COMP - PERAPPRIN";
  }

  // normal permission
  if (isStartShiftPerm) {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isStartShiftPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${endTime}`;
  }

  // (perm applytype === 'startshift' or 'inbetween') and comp applytype = 'startshift'
  if (isCompPerm && (isCompPerm.applytype === "startshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${endTime}`;
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  if (isCompPerm && isCompPerm.applytype === "startshift" && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${newEndTime}`;
  }

  if (isCompPerm && (isCompPerm.applytype === "endshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert end time to a moment object
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${startTime}to${newEndTime}`;
  }

  if (isCompPerm && isCompPerm.applytype === "endshift" && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${newEndTime}`;
  }

  // Get current date and time
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, "0");
  var mm = String(now.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = now.getFullYear();
  var today = dd + "/" + mm + "/" + yyyy;

  // Extract hours and minutes
  var hours = now.getHours();
  var minutes = now.getMinutes();

  // Format hours and minutes to always have two digits
  var formattedHours = String(hours).padStart(2, "0");
  var formattedMinutes = String(minutes).padStart(2, "0");

  // Combine hours and minutes into the desired format
  var currentTime = formattedHours + ":" + formattedMinutes;

  let startTime = parseTime(rowshift?.split("to")[0]);
  let startTimeWithPM = rowshift?.split("to")[0];

  if (!startTime) {
    return rowshift === "Not Allotted" ? "Not Allotted" : rowshift === "Pending..." ? "Not Allotted" : rowshift === "Week Off" && clockintime === "00:00:00" ? "Week Off" : "Invalid start time";
  }

  if (startTimeWithPM.includes("PM")) {
    // early clockintime
    const earlyTimeInMilliseconds = earlyClockInTime * 60000;
    const startTimeWithEarly = new Date(startTime?.getTime() - earlyTimeInMilliseconds);

    // Add graceTime to the startTime
    const graceTimeInMilliseconds = graceTime * 60000; // Convert graceTime to milliseconds
    const startTimeWithGrace = new Date(startTime?.getTime() + graceTimeInMilliseconds);

    // late clockin
    const lateTimeInMilliseconds = lateClockInTime * 60000;
    const startTimeWithLate = new Date(startTime.getTime() + graceTimeInMilliseconds + lateTimeInMilliseconds);

    // after late lop
    const halfLopTimeInMilliseconds = afterLateClockInTime * 60000;
    const startTimeWithHalfLop = new Date(startTime.getTime() + graceTimeInMilliseconds + lateTimeInMilliseconds + halfLopTimeInMilliseconds);

    // Adjust endTime if it's a night shift
    if (startTimeWithPM.includes("PM") && clockintime.includes("AM")) {
      clockInTime.setDate(clockInTime.getDate() + 1); // Move endTime to the next day
    }

    // Night Shift
    // Check if clockInTime is within the grace period
    if (isHoliday && rowshift !== "Week Off") {
      return "Holiday";
    } else if (leaveOnDateApprovedSingleFL) {
      return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
    } else if (leaveOnDateApprovedSingleHB) {
      return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
    } else if (leaveOnDateApprovedSingleHA) {
      return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
    } else if (leaveOnDateApprovedDoubleFL) {
      return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
    } else if (leaveOnDateApprovedDoubleHB) {
      return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
    } else if (leaveOnDateApprovedDoubleHA) {
      return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
    } else if (leaveOnDateApprovedDoubleDayFL) {
      return `DDL - ${leaveOnDateApprovedDoubleDayFL.code} ${leaveOnDateApprovedDoubleDayFL.status}`;
    } else if (leaveOnDateApprovedDoubleDayHB) {
      return `DDHB - ${leaveOnDateApprovedDoubleDayHB.code} ${leaveOnDateApprovedDoubleDayHB.status}`;
    } else if (leaveOnDateApprovedDoubleDayHA) {
      return `DDHA - ${leaveOnDateApprovedDoubleDayHA.code} ${leaveOnDateApprovedDoubleDayHA.status}`;
    } else if (rowshift === "Pending..." && clockintime !== "00:00:00") {
      return `Pending...`;
    } else if (rowshift === "Week Off" && clockintime === "00:00:00") {
      return `Week Off`;
    } else if (rowshift === "Not Allotted" && clockintime === "00:00:00") {
      return `Not Allotted`;
    } else if (weekoffpresentstatus === true) {
      return "Week Off Present";
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(":").map(Number)) < startTime) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && new Date(`${columnYear}-${columnMonth}-${columnDay}`) > new Date()) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    } else if (clockInTime >= startTimeWithEarly && clockInTime <= startTime) {
      return `On - Present`;
    } else if (clockInTime >= startTimeWithGrace && clockInTime <= startTimeWithLate) {
      return `Late - ClockIn`;
    } else if (clockInTime >= startTimeWithLate && clockInTime <= startTimeWithHalfLop) {
      return `HBLOP`;
    } else if (clockInTime >= startTimeWithHalfLop) {
      return `FLOP`;
    } else if (clockInTime >= startTime && clockInTime <= startTimeWithGrace) {
      return `Grace - ClockIn`;
    } else if (clockInTime < startTimeWithEarly) {
      return `Early - ClockIn`;
    } else {
      return `Present`;
    }
  } else {
    // early clockintime
    const earlyTimeInMilliseconds = earlyClockInTime * 60000;
    const startTimeWithEarly = new Date(startTime?.getTime() - earlyTimeInMilliseconds);

    // Add graceTime to the startTime
    const graceTimeInMilliseconds = graceTime * 60000; // Convert graceTime to milliseconds
    const startTimeWithGrace = new Date(startTime?.getTime() + graceTimeInMilliseconds);

    // late clockin
    const lateTimeInMilliseconds = lateClockInTime * 60000;
    const startTimeWithLate = new Date(startTime.getTime() + graceTimeInMilliseconds + lateTimeInMilliseconds);

    // after late lop
    const halfLopTimeInMilliseconds = afterLateClockInTime * 60000;
    const startTimeWithHalfLop = new Date(startTime.getTime() + graceTimeInMilliseconds + lateTimeInMilliseconds + halfLopTimeInMilliseconds);

    // Day Shift
    // Check if clockInTime is within the grace period
    if (isHoliday && rowshift !== "Week Off") {
      return "Holiday";
    }
    // else if (leaveOnDateCasualApproved.length > 0 && rowshift !== "Week Off") {
    //     return 'Leave ';
    // }
    else if (leaveOnDateApprovedSingleFL) {
      return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
    } else if (leaveOnDateApprovedSingleHB) {
      return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
    } else if (leaveOnDateApprovedSingleHA) {
      return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
    } else if (leaveOnDateApprovedDoubleFL) {
      return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
    } else if (leaveOnDateApprovedDoubleHB) {
      return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
    } else if (leaveOnDateApprovedDoubleHA) {
      return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
    } else if (leaveOnDateApprovedDoubleDayFL) {
      return `DDL - ${leaveOnDateApprovedDoubleDayFL.code} ${leaveOnDateApprovedDoubleDayFL.status}`;
    } else if (leaveOnDateApprovedDoubleDayHB) {
      return `DDHB - ${leaveOnDateApprovedDoubleDayHB.code} ${leaveOnDateApprovedDoubleDayHB.status}`;
    } else if (leaveOnDateApprovedDoubleDayHA) {
      return `DDHA - ${leaveOnDateApprovedDoubleDayHA.code} ${leaveOnDateApprovedDoubleDayHA.status}`;
    } else if (rowshift === "Pending..." && clockintime !== "00:00:00") {
      return `Pending...`;
    } else if (rowshift === "Week Off" && clockintime === "00:00:00") {
      return `Week Off`;
    } else if (rowshift === "Not Allotted" && clockintime === "00:00:00") {
      return `Not Allotted`;
    } else if (weekoffpresentstatus === true) {
      return "Week Off Present";
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(":").map(Number)) < startTime) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && new Date(`${columnYear}-${columnMonth}-${columnDay}`) > new Date()) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    } else if (clockInTime >= startTimeWithEarly && clockInTime <= startTime) {
      return `On - Present`;
    } else if (clockInTime >= startTimeWithGrace && clockInTime <= startTimeWithLate) {
      return `Late - ClockIn`;
    } else if (clockInTime >= startTimeWithLate && clockInTime <= startTimeWithHalfLop) {
      return `HBLOP`;
    } else if (clockInTime >= startTimeWithHalfLop) {
      return `FLOP`;
    } else if (clockInTime >= startTime && clockInTime <= startTimeWithGrace) {
      return `Grace - ClockIn`;
    } else if (clockInTime < startTimeWithEarly) {
      return `Early - ClockIn`;
    } else {
      return `Present`;
    }
  }
};

const checkClockOutStatus = (
  clockouttime,
  clockintime,
  rowshift,
  clockOutHours,
  clockindate,
  allLeaveStatus,
  holidays,
  rowbranch,
  rowempcode,
  rowcompany,
  rowformattedDate,
  rowunit,
  rowteam,
  rowcompanyname,
  onClockOutTime,
  earlyClockOutTime,
  beforeEarlyClockOutTime,
  autoClockOutStatus,
  leavetype,
  permission,
  rowshiftmode,
  weekoffpresentstatus,
  leavecriterias,
  weekNumberInMonth,
  dayName,
  rowdepartment,
  rowdesignation
) => {
  const totalFinalLeaveDaysApproved = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");
  const totalFinalLeaveDaysApprvedAndApplied = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");

  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "");

  const totalPermissionApprovedEnd = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "Compensation");

  const holidayResults = holidays.filter((item) => moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY") === rowformattedDate);

  const isHoliday = holidayResults.some((holiday) => (holiday.company?.includes(rowcompany) && holiday.applicablefor?.includes(rowbranch) && holiday.unit?.includes(rowunit) && holiday.team?.includes(rowteam) && holiday.employee.includes("ALL") ? rowcompanyname : holiday.employee?.includes(rowcompanyname)));

  let leavestatusApproved = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApproved &&
      totalFinalLeaveDaysApproved.forEach((d) => {
        if (type.leavetype === d.leavetype) {
          d.usershifts.forEach((shift) => {
            leavestatusApproved.push({
              date: shift.formattedDate,
              shiftmode: shift.shiftmode,
              leavetype: d.leavetype,
              status: d.status,
              code: type.code,
              tookleavecheckstatus: shift.tookleavecheckstatus,
              leavestatus: shift.leavestatus,
              shiftcount: shift.shiftcount,
            });
          });
        }
      });
  });

  let leaveWithoutApproved = [];

  totalFinalLeaveDaysApproved &&
    totalFinalLeaveDaysApproved.forEach((d) => {
      if (d.leavetype === "Leave Without Pay (LWP)") {
        d.usershifts.forEach((shift) => {
          leaveWithoutApproved.push({
            date: shift.formattedDate,
            shiftmode: shift.shiftmode,
            leavetype: d.leavetype,
            status: d.status,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        });
      }
    });

  const leaveOnDateApprovedSingleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveOnDateApprovedSingleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedSingleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveOnDateApprovedDoubleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveOnDateApprovedDoubleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedDoubleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedSingleFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedSingleHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedSingleHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedDoubleFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedDoubleHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedDoubleHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveOnDateApprovedDoubleDayFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveOnDateApprovedDoubleDayHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedDoubleDayHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedDoubleDayFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedDoubleDayHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedDoubleDayHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [columnDay, columnMonth, columnYear] = rowformattedDate?.split("/");
  const monthname = monthNames[columnMonth - 1];

  let isRemovedLeaveData = [];
  totalFinalLeaveDaysApprvedAndApplied.map((data) => {
    if (data.date?.includes(rowformattedDate)) {
      isRemovedLeaveData.push(rowformattedDate);
    }
  });

  const resemp = leavecriterias.filter((data) => data.mode === "Employee");
  const resdes = leavecriterias.filter((data) => data.mode === "Designation");
  const resdpt = leavecriterias.filter((data) => data.mode === "Department");

  let resultemp = resemp.find((d) => d.company?.includes(rowcompany) && d.branch?.includes(rowbranch) && d.unit?.includes(rowunit) && d.team?.includes(rowteam) && d.employee?.includes(rowcompanyname) && d.leavetype === "No Call/No Show");
  let resultdesg = resdes.find((d) => d.designation?.includes(rowdesignation) && d.leavetype === "No Call/No Show");
  let resultdept = resdpt.find((d) => d.department?.includes(rowdepartment) && d.leavetype === "No Call/No Show");

  let filteredresultemp = resemp.filter((d) => d.company?.includes(rowcompany) && d.branch?.includes(rowbranch) && d.unit?.includes(rowunit) && d.team?.includes(rowteam) && d.employee?.includes(rowcompanyname) && d.leavetype === "No Call/No Show");
  let filteredresultdesg = resdes.filter((d) => d.designation?.includes(rowdesignation) && d.leavetype === "No Call/No Show");
  let filteredresultdept = resdpt.filter((d) => d.department?.includes(rowdepartment) && d.leavetype === "No Call/No Show");

  let finalleavecriterias = resultemp ? filteredresultemp : resultdesg ? filteredresultdesg : resultdept ? filteredresultdept : [];

  let isBlockDaysMatch = [];
  finalleavecriterias.flat().find((d) => {
    d.tookleave.forEach((val) => {
      if (val.year === columnYear && val.month === monthname && val.week === weekNumberInMonth && val.day === dayName && clockintime === "00:00:00" && rowshift !== "Week Off") {
        isBlockDaysMatch.push(rowformattedDate);
      }
    });
  });
  const uniqueIsBlockDaysDate = [...new Set(isBlockDaysMatch)];

  let finalData = [];
  if (isRemovedLeaveData.length > 0) {
    finalData = uniqueIsBlockDaysDate.filter((data) => !isRemovedLeaveData.includes(data));
  } else {
    finalData = [...uniqueIsBlockDaysDate];
  }

  if (finalData?.includes(rowformattedDate) && clockintime === "00:00:00" && rowshift !== "Week Off" && new Date(`${columnYear}-${columnMonth}-${columnDay}`) < new Date()) {
    return `BL - Absent`;
  }

  if (leaveOnDateApprovedSingleFL) {
    return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
  } else if (leaveOnDateApprovedSingleHB) {
    return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
  } else if (leaveOnDateApprovedSingleHA) {
    return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
  } else if (leaveOnDateApprovedDoubleFL) {
    return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
  } else if (leaveOnDateApprovedDoubleHB) {
    return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
  } else if (leaveOnDateApprovedDoubleHA) {
    return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
  } else if (leaveOnDateApprovedDoubleDayFL) {
    return `DDL - ${leaveOnDateApprovedDoubleDayFL.code} ${leaveOnDateApprovedDoubleDayFL.status}`;
  } else if (leaveOnDateApprovedDoubleDayHB) {
    return `DDHB - ${leaveOnDateApprovedDoubleDayHB.code} ${leaveOnDateApprovedDoubleDayHB.status}`;
  } else if (leaveOnDateApprovedDoubleDayHA) {
    return `DDHA - ${leaveOnDateApprovedDoubleDayHA.code} ${leaveOnDateApprovedDoubleDayHA.status}`;
  } else if (leaveWithoutOnDateApprovedSingleFL) {
    return `LWP ${leaveWithoutOnDateApprovedSingleFL.status}`;
  } else if (leaveWithoutOnDateApprovedSingleHB) {
    return `HB - LWP ${leaveWithoutOnDateApprovedSingleHB.status}`;
  } else if (leaveWithoutOnDateApprovedSingleHA) {
    return `HA - LWP ${leaveWithoutOnDateApprovedSingleHA.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleFL) {
    return `DL - LWP ${leaveWithoutOnDateApprovedDoubleFL.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleHB) {
    return `DHB - LWP ${leaveWithoutOnDateApprovedDoubleHB.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleHA) {
    return `DHA - LWP ${leaveWithoutOnDateApprovedDoubleHA.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayFL) {
    return `DDL - LWP ${leaveWithoutOnDateApprovedDoubleDayFL.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayHB) {
    return `DDHB - LWP ${leaveWithoutOnDateApprovedDoubleDayHB.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayHA) {
    return `DDHA - LWP ${leaveWithoutOnDateApprovedDoubleDayHA.status}`;
  }

  const isEndShiftPerm = permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode && d.applytype === "endshift");
  const isCompPerm = totalPermissionApprovedEnd.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode);
  let clockOutTime = parseTime(clockouttime);

  const actualEndTime = parseTime(rowshift?.split("to")[1]);
  if (!actualEndTime) {
    return rowshift === "Not Allotted" ? "Not Allotted" : rowshift === "Week Off" && clockintime === "00:00:00" ? "Week Off" : "Invalid start time";
  }

  // normal permission
  if (isEndShiftPerm) {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert end time to a moment object
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newEndMoment = endMoment.subtract(isEndShiftPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${startTime}to${newEndTime}`;
  }
  // normal permission
  const permTimeInMilliseconds = (isEndShiftPerm && isEndShiftPerm.requesthours) * 60000;
  const startTimeWithPerm = new Date(actualEndTime?.getTime() - permTimeInMilliseconds);
  if (isEndShiftPerm && clockOutTime >= startTimeWithPerm && clockOutTime <= actualEndTime) {
    return "PERAPPR - OUT";
  }

  // (perm applytype === 'startshift' or 'inbetween') and comp applytype = 'startshift'
  if (isCompPerm && (isCompPerm.applytype === "startshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${endTime}`;
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  if (isCompPerm && isCompPerm.applytype === "startshift" && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${newEndTime}`;
  }

  // (perm applytype === 'endshift' or 'inbetween') and comp applytype = 'endshift'
  if (isCompPerm && (isCompPerm.applytype === "endshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert end time to a moment object
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${startTime}to${newEndTime}`;
  }

  // (perm applytype === 'endshift' or 'inbetween') and comp applytype = 'endshift'
  const compEnd_EndPermTimeInMilliseconds = (isCompPerm && isCompPerm.requesthours) * 60000;
  const compEndTimeWithPermEnd = new Date(actualEndTime?.getTime() + compEnd_EndPermTimeInMilliseconds);
  if (isCompPerm && (isCompPerm.applytype === "endshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "endshift" && clockOutTime >= actualEndTime && clockOutTime <= compEndTimeWithPermEnd) {
    return "COMP - PERAPPROUT";
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  if (isCompPerm && isCompPerm.applytype === "endshift" && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    rowshift = `${newStartTime}to${newEndTime}`;
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  const compEnd_StartPermTimeInMilliseconds = (isCompPerm && isCompPerm.requesthours) * 60000;
  const compEndTimeWithPermStart = new Date(actualEndTime?.getTime() - compEnd_StartPermTimeInMilliseconds);
  if (isCompPerm && isCompPerm.applytype === "endshift" && isCompPerm.compensationapplytype === "startshift" && clockOutTime >= compEndTimeWithPermStart && clockOutTime <= actualEndTime) {
    return "COMP - PERAPPROUT";
  }

  if (weekoffpresentstatus === true) {
    return "Week Off Present";
  }

  // Get current date and time
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, "0");
  var mm = String(now.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = now.getFullYear();
  var today = dd + "/" + mm + "/" + yyyy;

  // Extract hours and minutes
  var hours = now.getHours();
  var minutes = now.getMinutes();

  // Format hours and minutes to always have two digits
  var formattedHours = String(hours).padStart(2, "0");
  var formattedMinutes = String(minutes).padStart(2, "0");

  // Combine hours and minutes into the desired format
  var currentTime = formattedHours + ":" + formattedMinutes;

  let startTime = parseTime(rowshift?.split("to")[0]);
  let startTimeWithPM = rowshift?.split("to")[0];

  let endTime = parseTime(rowshift?.split("to")[1]);

  if (!startTime) {
    return rowshift === "Not Allotted" ? "Not Allotted" : rowshift === "Week Off" && clockintime === "00:00:00" ? "Week Off" : "Invalid start time";
  }

  if (!endTime) {
    return rowshift === "Not Allotted" ? "Not Allotted" : rowshift === "Week Off" && clockouttime === "00:00:00" ? "Week Off" : rowshift === "Pending..." && clockouttime !== "00:00:00" ? "Pending..." : "Invalid end time";
  }

  // Determine if it's a night shift
  const isNightShift = startTime.getHours() >= 12;

  // Compare clockouttime based on shift type
  if (startTimeWithPM.includes("PM")) {
    // Adjust endTime if it's a night shift
    if (startTimeWithPM.includes("PM") && clockouttime.includes("AM")) {
      // Check if endTime is before startTime (indicating the shift crosses midnight)
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1); // Move endTime to the next day
        clockOutTime.setDate(clockOutTime.getDate() + 1);
      }
    } else if (startTimeWithPM.includes("PM") && clockouttime.includes("PM")) {
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
        clockOutTime.setDate(clockOutTime.getDate() - 1);
      }
    }

    // Add onClockOutTime to the endTime
    const onClockOutMilliseconds = onClockOutTime * 60000; // Convert onClockOutTime to milliseconds
    const endTimeWithGrace = new Date(endTime?.getTime() + onClockOutMilliseconds);

    // subtract earlyClockOutTime to the endTime
    const earlyClockOutMilliseconds = earlyClockOutTime * 60000;
    const endTimeWithEarly = new Date(endTime?.getTime() - earlyClockOutMilliseconds);

    // subtract earlyClockOutTime to the endTime
    const beforeEarlyClockOutMilliseconds = beforeEarlyClockOutTime * 60000;
    const endTimeWithBeforeEarly = new Date(endTime?.getTime() - earlyClockOutMilliseconds - beforeEarlyClockOutMilliseconds);

    const [rowday, rowmonth, rowyear] = rowformattedDate.split("/");
    const addrowday = Number(rowday) + 1;
    const endRowDayAdd = String(addrowday).padStart(2, "0");

    const currentDate = new Date();
    const curyear = currentDate.getFullYear();
    const curmonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month as it's zero-based
    const curday = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const endHoursN8 = String(endTime?.getHours()).padStart(2, "0");
    const endMinutesN8 = String(endTime?.getMinutes()).padStart(2, "0");
    const endSecondsN8 = String(endTime?.getSeconds()).padStart(2, "0");

    const currentDateTimeString = `${curyear}-${curmonth}-${curday} ${hours}:${minutes}:${seconds}`;
    const getEndTimeForNight = `${rowyear}-${rowmonth}-${endRowDayAdd} ${endHoursN8}:${endMinutesN8}:${endSecondsN8}`;

    // Night shift
    if (isHoliday && rowshift !== "Week Off") {
      return "Holiday";
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(":").map(Number)) < startTime) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && new Date(`${columnYear}-${columnMonth}-${columnDay}`) > new Date()) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && clockouttime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    } else if (rowshift === "Pending..." && clockouttime !== "00:00:00") {
      return `Pending...`;
    } else if (rowshift === "Week Off" && clockouttime === "00:00:00") {
      return `Week Off`;
    } else if (rowshift === "Not Allotted" && clockouttime === "00:00:00") {
      return `Not Allotted`;
    } else if (autoClockOutStatus === true && clockouttime !== "00:00:00") {
      return `Auto Mis - ClockOut`;
    } else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithEarly && clockOutTime < endTime) {
      return `Early - ClockOut`;
    } else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithBeforeEarly && clockOutTime < endTimeWithEarly) {
      return `HALOP`;
    } else if (clockouttime !== "00:00:00" && clockOutTime < endTimeWithBeforeEarly) {
      return `FLOP`;
    } else if (clockOutTime >= endTime && clockOutTime <= endTimeWithGrace) {
      return `On - ClockOut`;
    } else if (clockouttime !== "00:00:00" && clockOutTime > endTimeWithGrace) {
      return `Over - ClockOut`;
    } else if (clockintime !== "00:00:00" && clockouttime === "00:00:00" && currentDateTimeString <= getEndTimeForNight) {
      return `Pending`;
    } else if (clockouttime === "00:00:00") {
      return `Mis - ClockOut`;
    }
  } else {
    // Parse the clock in date
    const [day, month, year] = clockindate.split("-");
    const shiftStartDate = new Date(Number(year), Number(month) - 1, Number(day));
    const shiftEndDate = new Date(Number(year), Number(month) - 1, Number(day));

    // If endTime is before startTime, it indicates the shift crosses midnight
    // Adjust endTime accordingly
    if (endTime < startTime) {
      shiftEndDate.setDate(shiftEndDate.getDate() + 1); // Adjust shiftEndDate to the next day
    }

    const [rowday, rowmonth, rowyear] = rowformattedDate.split("/");
    const addrowday = Number(rowday) + 1;
    const endRowDayAdd = String(addrowday).padStart(2, "0");

    const currentDate = new Date();
    const curyear = currentDate.getFullYear();
    const curmonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month as it's zero-based
    const curday = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    const endHoursN8 = String(endTime?.getHours()).padStart(2, "0");
    const endMinutesN8 = String(endTime?.getMinutes()).padStart(2, "0");
    const endSecondsN8 = String(endTime?.getSeconds()).padStart(2, "0");

    const currentDateTimeString = `${curyear}-${curmonth}-${curday} ${hours}:${minutes}:${seconds}`;
    const getEndTimeForNight = `${rowyear}-${rowmonth}-${endRowDayAdd} ${endHoursN8}:${endMinutesN8}:${endSecondsN8}`;

    // Add onClockOutTime to the endTime
    const onClockOutMilliseconds = onClockOutTime * 60000; // Convert onClockOutTime to milliseconds
    const endTimeWithGrace = new Date(endTime.getTime() + onClockOutMilliseconds);

    // subtract earlyClockOutTime to the endTime
    const earlyClockOutMilliseconds = earlyClockOutTime * 60000;
    const endTimeWithEarly = new Date(endTime.getTime() - earlyClockOutMilliseconds);

    // subtract earlyClockOutTime to the endTime
    const beforeEarlyClockOutMilliseconds = beforeEarlyClockOutTime * 60000;
    const endTimeWithBeforeEarly = new Date(endTime.getTime() - earlyClockOutMilliseconds - beforeEarlyClockOutMilliseconds);

    // Day shift
    if (isHoliday && rowshift !== "Week Off") {
      return "Holiday";
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(":").map(Number)) < startTime) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && rowshift !== "Week Off" && new Date(`${columnYear}-${columnMonth}-${columnDay}`) > new Date()) {
      return `Shift Not Started`;
    } else if (clockintime === "00:00:00" && clockouttime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    } else if (rowshift === "Pending..." && clockouttime !== "00:00:00") {
      return `Pending...`;
    } else if (rowshift === "Week Off" && clockouttime === "00:00:00") {
      return `Week Off`;
    } else if (rowshift === "Not Allotted" && clockouttime === "00:00:00") {
      return `Not Allotted`;
    } else if (autoClockOutStatus === true && clockouttime !== "00:00:00") {
      return `Auto Mis - ClockOut`;
    } else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithEarly && clockOutTime < endTime) {
      return `Early - ClockOut`;
    } else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithBeforeEarly && clockOutTime < endTimeWithEarly) {
      return `HALOP`;
    } else if (clockouttime !== "00:00:00" && clockOutTime < endTimeWithBeforeEarly) {
      return `FLOP`;
    } else if (clockOutTime >= endTime && clockOutTime <= endTimeWithGrace) {
      return `On - ClockOut`;
    } else if (clockintime !== "00:00:00" && clockOutTime > endTimeWithGrace) {
      return `Over - ClockOut`;
    } else if (clockintime !== "00:00:00" && clockouttime === "00:00:00" && currentDateTimeString <= getEndTimeForNight) {
      return `Pending`;
    } else if (clockouttime === "00:00:00") {
      return `Mis - ClockOut`;
    }
  }
};

const checkLeaveStatus = (allLeaveStatus, rowempcode, rowformattedDate, leavetype, rowshiftmode) => {
  const totalFinalLeaveDaysApproved = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");
  const totalFinalLeaveDaysApplied = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Applied");
  const totalFinalLeaveDaysRejected = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Rejected");

  let leavestatusApproved = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApproved &&
      totalFinalLeaveDaysApproved.forEach((d) => {
        if (type.leavetype === d.leavetype) {
          d.usershifts.forEach((shift) => {
            leavestatusApproved.push({
              date: shift.formattedDate,
              shiftmode: shift.shiftmode,
              leavetype: d.leavetype,
              status: d.status,
              code: type.code,
              tookleavecheckstatus: shift.tookleavecheckstatus,
              leavestatus: shift.leavestatus,
              shiftcount: shift.shiftcount,
            });
          });
        }
      });
  });

  let leavestatusApplied = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApplied &&
      totalFinalLeaveDaysApplied.forEach((d) => {
        if (type.leavetype === d.leavetype) {
          d.usershifts.forEach((shift) => {
            leavestatusApplied.push({
              date: shift.formattedDate,
              shiftmode: shift.shiftmode,
              leavetype: d.leavetype,
              status: d.status,
              code: type.code,
              tookleavecheckstatus: shift.tookleavecheckstatus,
              leavestatus: shift.leavestatus,
              shiftcount: shift.shiftcount,
            });
          });
        }
      });
  });

  let leavestatusRejected = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysRejected &&
      totalFinalLeaveDaysRejected.forEach((d) => {
        if (type.leavetype === d.leavetype) {
          d.usershifts.forEach((shift) => {
            leavestatusRejected.push({
              date: shift.formattedDate,
              shiftmode: shift.shiftmode,
              leavetype: d.leavetype,
              status: d.status,
              code: type.code,
              tookleavecheckstatus: shift.tookleavecheckstatus,
              leavestatus: shift.leavestatus,
              shiftcount: shift.shiftcount,
            });
          });
        }
      });
  });

  let leaveWithoutApproved = [];

  totalFinalLeaveDaysApproved &&
    totalFinalLeaveDaysApproved.forEach((d) => {
      if (d.leavetype === "Leave Without Pay (LWP)") {
        d.usershifts.forEach((shift) => {
          leaveWithoutApproved.push({
            date: shift.formattedDate,
            shiftmode: shift.shiftmode,
            leavetype: d.leavetype,
            status: d.status,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        });
      }
    });

  let leaveWithoutApplied = [];

  totalFinalLeaveDaysApplied &&
    totalFinalLeaveDaysApplied.forEach((d) => {
      if (d.leavetype === "Leave Without Pay (LWP)") {
        d.usershifts.forEach((shift) => {
          leaveWithoutApplied.push({
            date: shift.formattedDate,
            shiftmode: shift.shiftmode,
            leavetype: d.leavetype,
            status: d.status,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        });
      }
    });

  let leaveWithoutRejected = [];

  totalFinalLeaveDaysRejected &&
    totalFinalLeaveDaysRejected.forEach((d) => {
      if (d.leavetype === "Leave Without Pay (LWP)") {
        d.usershifts.forEach((shift) => {
          leaveWithoutRejected.push({
            date: shift.formattedDate,
            shiftmode: shift.shiftmode,
            leavetype: d.leavetype,
            status: d.status,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        });
      }
    });

  const leaveOnDateApprovedSingleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveOnDateApprovedSingleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedSingleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveOnDateApprovedDoubleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveOnDateApprovedDoubleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedDoubleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveOnDateApprovedDoubleDayFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveOnDateApprovedDoubleDayHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveOnDateApprovedDoubleDayHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveOnDateAppliedSingleFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveOnDateAppliedSingleHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveOnDateAppliedSingleHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveOnDateAppliedDoubleFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveOnDateAppliedDoubleHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveOnDateAppliedDoubleHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveOnDateAppliedDoubleDayFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveOnDateAppliedDoubleDayHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveOnDateAppliedDoubleDayHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveOnDateRejectedSingleFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveOnDateRejectedSingleHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveOnDateRejectedSingleHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveOnDateRejectedDoubleFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveOnDateRejectedDoubleHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveOnDateRejectedDoubleHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveOnDateRejectedDoubleDayFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveOnDateRejectedDoubleDayHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveOnDateRejectedDoubleDayHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedSingleFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedSingleHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedSingleHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedDoubleFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedDoubleHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedDoubleHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateApprovedDoubleDayFL = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveWithoutOnDateApprovedDoubleDayHB = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateApprovedDoubleDayHA = leaveWithoutApproved.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateAppliedSingleFL = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveWithoutOnDateAppliedSingleHB = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateAppliedSingleHA = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateAppliedDoubleFL = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveWithoutOnDateAppliedDoubleHB = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateAppliedDoubleHA = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateAppliedDoubleDayFL = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveWithoutOnDateAppliedDoubleDayHB = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateAppliedDoubleDayHA = leaveWithoutApplied.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateRejectedSingleFL = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Shift");
  const leaveWithoutOnDateRejectedSingleHB = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateRejectedSingleHA = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Single" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateRejectedDoubleFL = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Shift");
  const leaveWithoutOnDateRejectedDoubleHB = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateRejectedDoubleHA = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double" && d.leavestatus === "After Half Shift");

  const leaveWithoutOnDateRejectedDoubleDayFL = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Shift");
  const leaveWithoutOnDateRejectedDoubleDayHB = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "Before Half Shift");
  const leaveWithoutOnDateRejectedDoubleDayHA = leaveWithoutRejected.find((d) => d.date === rowformattedDate && d.shiftmode === rowshiftmode && d.tookleavecheckstatus === "Double Day" && d.leavestatus === "After Half Shift");

  if (leaveWithoutOnDateApprovedSingleFL) {
    return `LWP ${leaveWithoutOnDateApprovedSingleFL.status}`;
  } else if (leaveWithoutOnDateApprovedSingleHB) {
    return `HB - LWP ${leaveWithoutOnDateApprovedSingleHB.status}`;
  } else if (leaveWithoutOnDateApprovedSingleHA) {
    return `HA - LWP ${leaveWithoutOnDateApprovedSingleHA.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleFL) {
    return `DL - LWP ${leaveWithoutOnDateApprovedDoubleFL.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleHB) {
    return `DHB - LWP ${leaveWithoutOnDateApprovedDoubleHB.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleHA) {
    return `DHA - LWP ${leaveWithoutOnDateApprovedDoubleHA.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayFL) {
    return `DDL - LWP ${leaveWithoutOnDateApprovedDoubleDayFL.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayHB) {
    return `DDHB - LWP ${leaveWithoutOnDateApprovedDoubleDayHB.status}`;
  } else if (leaveWithoutOnDateApprovedDoubleDayHA) {
    return `DDHA - LWP ${leaveWithoutOnDateApprovedDoubleDayHA.status}`;
  } else if (leaveWithoutOnDateAppliedSingleFL) {
    return `LWP ${leaveWithoutOnDateAppliedSingleFL.status}`;
  } else if (leaveWithoutOnDateAppliedSingleHB) {
    return `HB - LWP ${leaveWithoutOnDateAppliedSingleHB.status}`;
  } else if (leaveWithoutOnDateAppliedSingleHA) {
    return `HA - LWP ${leaveWithoutOnDateAppliedSingleHA.status}`;
  } else if (leaveWithoutOnDateAppliedDoubleFL) {
    return `DL - LWP ${leaveWithoutOnDateAppliedDoubleFL.status}`;
  } else if (leaveWithoutOnDateAppliedDoubleHB) {
    return `DHB - LWP ${leaveWithoutOnDateAppliedDoubleHB.status}`;
  } else if (leaveWithoutOnDateAppliedDoubleHA) {
    return `DHA - LWP ${leaveWithoutOnDateAppliedDoubleHA.status}`;
  } else if (leaveWithoutOnDateAppliedDoubleDayFL) {
    return `DDL - LWP ${leaveWithoutOnDateAppliedDoubleDayFL.status}`;
  } else if (leaveWithoutOnDateAppliedDoubleDayHB) {
    return `DDHB - LWP ${leaveWithoutOnDateAppliedDoubleDayHB.status}`;
  } else if (leaveWithoutOnDateAppliedDoubleDayHA) {
    return `DDHA - LWP ${leaveWithoutOnDateAppliedDoubleDayHA.status}`;
  } else if (leaveWithoutOnDateRejectedSingleFL) {
    return `LWP ${leaveWithoutOnDateRejectedSingleFL.status}`;
  } else if (leaveWithoutOnDateRejectedSingleHB) {
    return `HB - LWP ${leaveWithoutOnDateRejectedSingleHB.status}`;
  } else if (leaveWithoutOnDateRejectedSingleHA) {
    return `HA - LWP ${leaveWithoutOnDateRejectedSingleHA.status}`;
  } else if (leaveWithoutOnDateRejectedDoubleFL) {
    return `DL - LWP ${leaveWithoutOnDateRejectedDoubleFL.status}`;
  } else if (leaveWithoutOnDateRejectedDoubleHB) {
    return `DHB - LWP ${leaveWithoutOnDateRejectedDoubleHB.status}`;
  } else if (leaveWithoutOnDateRejectedDoubleHA) {
    return `DHA - LWP ${leaveWithoutOnDateRejectedDoubleHA.status}`;
  } else if (leaveWithoutOnDateRejectedDoubleDayFL) {
    return `DDL - LWP ${leaveWithoutOnDateRejectedDoubleDayFL.status}`;
  } else if (leaveWithoutOnDateRejectedDoubleDayHB) {
    return `DDHB - LWP ${leaveWithoutOnDateRejectedDoubleDayHB.status}`;
  } else if (leaveWithoutOnDateRejectedDoubleDayHA) {
    return `DDHA - LWP ${leaveWithoutOnDateRejectedDoubleDayHA.status}`;
  }

  if (leaveOnDateApprovedSingleFL) {
    return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
  } else if (leaveOnDateApprovedSingleHB) {
    return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
  } else if (leaveOnDateApprovedSingleHA) {
    return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
  } else if (leaveOnDateApprovedDoubleFL) {
    return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
  } else if (leaveOnDateApprovedDoubleHB) {
    return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
  } else if (leaveOnDateApprovedDoubleHA) {
    return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
  } else if (leaveOnDateApprovedDoubleDayFL) {
    return `DDL - ${leaveOnDateApprovedDoubleDayFL.code} ${leaveOnDateApprovedDoubleDayFL.status}`;
  } else if (leaveOnDateApprovedDoubleDayHB) {
    return `DDHB - ${leaveOnDateApprovedDoubleDayHB.code} ${leaveOnDateApprovedDoubleDayHB.status}`;
  } else if (leaveOnDateApprovedDoubleDayHA) {
    return `DDHA - ${leaveOnDateApprovedDoubleDayHA.code} ${leaveOnDateApprovedDoubleDayHA.status}`;
  } else if (leaveOnDateAppliedSingleFL) {
    return `${leaveOnDateAppliedSingleFL.code} ${leaveOnDateAppliedSingleFL.status}`;
  } else if (leaveOnDateAppliedSingleHB) {
    return `HB - ${leaveOnDateAppliedSingleHB.code} ${leaveOnDateAppliedSingleHB.status}`;
  } else if (leaveOnDateAppliedSingleHA) {
    return `HA - ${leaveOnDateAppliedSingleHA.code} ${leaveOnDateAppliedSingleHA.status}`;
  } else if (leaveOnDateAppliedDoubleFL) {
    return `DL - ${leaveOnDateAppliedDoubleFL.code} ${leaveOnDateAppliedDoubleFL.status}`;
  } else if (leaveOnDateAppliedDoubleHB) {
    return `DHB - ${leaveOnDateAppliedDoubleHB.code} ${leaveOnDateAppliedDoubleHB.status}`;
  } else if (leaveOnDateAppliedDoubleHA) {
    return `DHA - ${leaveOnDateAppliedDoubleHA.code} ${leaveOnDateAppliedDoubleHA.status}`;
  } else if (leaveOnDateAppliedDoubleDayFL) {
    return `DDL - ${leaveOnDateAppliedDoubleDayFL.code} ${leaveOnDateAppliedDoubleDayFL.status}`;
  } else if (leaveOnDateAppliedDoubleDayHB) {
    return `DDHB - ${leaveOnDateAppliedDoubleDayHB.code} ${leaveOnDateAppliedDoubleDayHB.status}`;
  } else if (leaveOnDateAppliedDoubleDayHA) {
    return `DDHA - ${leaveOnDateAppliedDoubleDayHA.code} ${leaveOnDateAppliedDoubleDayHA.status}`;
  } else if (leaveOnDateRejectedSingleFL) {
    return `${leaveOnDateRejectedSingleFL.code} ${leaveOnDateRejectedSingleFL.status}`;
  } else if (leaveOnDateRejectedSingleHB) {
    return `HB - ${leaveOnDateRejectedSingleHB.code} ${leaveOnDateRejectedSingleHB.status}`;
  } else if (leaveOnDateRejectedSingleHA) {
    return `HA - ${leaveOnDateRejectedSingleHA.code} ${leaveOnDateRejectedSingleHA.status}`;
  } else if (leaveOnDateRejectedDoubleFL) {
    return `DL - ${leaveOnDateRejectedDoubleFL.code} ${leaveOnDateRejectedDoubleFL.status}`;
  } else if (leaveOnDateRejectedDoubleHB) {
    return `DHB - ${leaveOnDateRejectedDoubleHB.code} ${leaveOnDateRejectedDoubleHB.status}`;
  } else if (leaveOnDateRejectedDoubleHA) {
    return `DHA - ${leaveOnDateRejectedDoubleHA.code} ${leaveOnDateRejectedDoubleHA.status}`;
  } else if (leaveOnDateRejectedDoubleDayFL) {
    return `DDL - ${leaveOnDateRejectedDoubleDayFL.code} ${leaveOnDateRejectedDoubleDayFL.status}`;
  } else if (leaveOnDateRejectedDoubleDayHB) {
    return `DDHB - ${leaveOnDateRejectedDoubleDayHB.code} ${leaveOnDateRejectedDoubleDayHB.status}`;
  } else if (leaveOnDateRejectedDoubleDayHA) {
    return `DDHA - ${leaveOnDateRejectedDoubleDayHA.code} ${leaveOnDateRejectedDoubleDayHA.status}`;
  } else {
    return `None`;
  }
};

const checkPermissionStatus = (rowempcode, rowformattedDate, permission, rowshiftmode) => {
  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "");
  const permissionAppliedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === "");
  const permissionRejectedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Rejected" && d.compensationstatus === "");

  const totalPermissionApprovedEnd = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "Compensation");
  const totalPermissionAppliedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === "Compensation");
  const totalPermissionRejectedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Rejected" && d.compensationstatus === "Compensation");

  if (permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode)) {
    return "PERAPPR";
  } else if (permissionAppliedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode)) {
    return "PERAPPL";
  } else if (permissionRejectedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode)) {
    return "PERREJ";
  } else if (totalPermissionApprovedEnd.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode)) {
    return "COMP - PERAPPR";
  }
  if (totalPermissionAppliedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode)) {
    return "COMP - PERAPPL";
  } else if (totalPermissionRejectedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode)) {
    return "COMP - PERREJ";
  } else {
    return `None`;
  }
};

const getActualShiftTimeBasedOnPermission = (clockintime, rowshift, rowempcode, rowformattedDate, permission, rowshiftmode) => {
  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "");

  const totalPermissionApprovedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "Compensation");

  const isStartShiftPerm = permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode && d.applytype === "startshift");
  const isCompPerm = totalPermissionApprovedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode);

  const actualStartTime = parseTime(rowshift?.split("to")[0]);
  if (!actualStartTime) {
    return rowshift === "Not Allotted" ? "Not Allotted" : rowshift === "Week Off" && clockintime === "00:00:00" ? "Week Off" : "Invalid start time";
  }

  // normal permission
  if (isStartShiftPerm) {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isStartShiftPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${endTime}`;
  }

  // (perm applytype === 'startshift' or 'inbetween') and comp applytype = 'startshift'
  if (isCompPerm && (isCompPerm.applytype === "startshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${endTime}`;
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  if (isCompPerm && isCompPerm.applytype === "startshift" && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${newEndTime}`;
  }

  if (isCompPerm && (isCompPerm.applytype === "endshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert end time to a moment object
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${startTime}to${newEndTime}`;
  }

  if (isCompPerm && isCompPerm.applytype === "endshift" && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${newEndTime}`;
  }
};

const getLoginActualShiftTimeBasedOnPermission = (rowshift, rowempcode, rowformattedDate, permission, rowshiftmode) => {
  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "");

  const totalPermissionApprovedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === "Compensation");

  const isStartShiftPerm = permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode && d.applytype === "startshift");
  const isCompPerm = totalPermissionApprovedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate) && d.shiftmode === rowshiftmode);

  const actualStartTime = parseTime(rowshift?.split("to")[0]);

  // normal permission
  if (isStartShiftPerm) {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isStartShiftPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${endTime}`;
  }

  // (perm applytype === 'startshift' or 'inbetween') and comp applytype = 'startshift'
  if (isCompPerm && (isCompPerm.applytype === "startshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${endTime}`;
  }

  // perm applytype === 'startshift' and comp applytype = 'endshift'
  if (isCompPerm && isCompPerm.applytype === "startshift" && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.add(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${newEndTime}`;
  }

  if (isCompPerm && (isCompPerm.applytype === "endshift" || isCompPerm.applytype === "inbetween") && isCompPerm.compensationapplytype === "endshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert end time to a moment object
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newEndMoment = endMoment.add(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${startTime}to${newEndTime}`;
  }

  if (isCompPerm && isCompPerm.applytype === "endshift" && isCompPerm.compensationapplytype === "startshift") {
    // Extract start and end time from rowshift
    let [startTime, endTime] = rowshift.split("to");

    // Convert start time to a moment object
    let startMoment = moment(startTime, "hh:mmA");
    let endMoment = moment(endTime, "hh:mmA");

    // Add the requesthours to the start time
    let newStartMoment = startMoment.subtract(isCompPerm.requesthours, "minutes");
    let newEndMoment = endMoment.subtract(isCompPerm.requesthours, "minutes");

    // Format new start time back to hh:mmA
    let newStartTime = newStartMoment.format("hh:mmA");
    let newEndTime = newEndMoment.format("hh:mmA");

    // Update rowshift with the new start time
    return `${newStartTime}to${newEndTime}`;
  }

  return rowshift;
};

function getWeekNumberInMonth(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

  // If the first day of the month is not Monday (1), calculate the adjustment
  const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Calculate the day of the month adjusted for the starting day of the week
  const dayOfMonthAdjusted = date.getDate() + adjustment;

  // Calculate the week number based on the adjusted day of the month
  const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

  return weekNumber;
}

const getShiftForDateProdDay = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment, matchingRemovedItem, matchingAssignShiftItem) => {
  // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

  // if (selectedDateIndex === -1) {
  //     return !isWeekOff ? actualShiftTiming : "Week Off";
  // }

  // if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
  //     return `${matchingItem?._doc?.selectedShifTime.split(' - ')[0]}to${matchingItem?._doc?.selectedShifTime.split(' - ')[1]}`;
  // }
  // else
  if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "WeekOff Adjustment") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Adjustment") {
    if (matchingAssignShiftItem && matchingDoubleShiftItem?._doc?.todate === matchingAssignShiftItem?._doc?.adjdate) {
      return `${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    } else {
      return "Not Allotted";
    }
  } else if (matchingRemovedItem && matchingRemovedItem?._doc?.adjstatus === "Not Allotted") {
    return "Not Allotted";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Approved") {
    if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === "Shift Adjustment" || matchingItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
      if (column.shiftMode === "Main Shift") {
        return `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
      } else if (column.shiftMode === "Second Shift") {
        return `${matchingItem?._doc?.pluseshift.split(" - ")[0]}to${matchingItem?._doc?.pluseshift.split(" - ")[1]}`;
      }
    } else {
      return isWeekOffWithAdjustment ? `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}` : `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    }
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
    return isWeekOffWithManual ? `${matchingItemAllot._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} ` : `${matchingItemAllot?._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `;
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
    return "Week Off";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Reject" && isWeekOff) {
    // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    return "Week Off";
  }
  // before add shifttype condition working code
  // else if (boardingLog?.length > 0) {

  //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
  //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

  //     // Filter boardingLog entries for the same start date
  //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

  //     // If there are entries for the date, return the shift timing of the second entry
  //     if (entriesForDate.length > 1) {
  //         return entriesForDate[1].shifttiming;
  //     }

  //     // Find the most recent boarding log entry that is less than or equal to the selected date
  //     const recentLogEntry = boardingLog
  //         .filter(log => log.startdate < finalDate)
  //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

  //     // If a recent log entry is found, return its shift timing
  //     if (recentLogEntry) {
  //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
  //     } else {
  //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
  //         return !isWeekOff ? actualShiftTiming : "Week Off";
  //     }
  // }
  else if (boardingLog.length > 0) {
    // Remove duplicate entries with recent entry
    const uniqueEntries = {};
    boardingLog.forEach((entry) => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date
    const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

    if (relevantLogEntry) {
      // Daily
      if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "Daily") {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      // 2 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "1 Week Rotation") {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

        // Calculate the day count until the next Sunday
        let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number
        const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === "2 Week Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        const currentDate = new Date(finalDate);

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        // Calculate total days for 1-month rotation based on the effective month
        let totalDays = monthLengths[effectiveMonth];

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          // Set startDate to the next matchingDepartment.fromdate for each cycle
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = monthLengths[effectiveMonth];

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
        }

        // Calculate the difference in days correctly
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

        // Calculate the week number within the rotation month based on 7-day intervals from start date
        // const weekNumber = Math.ceil(diffDays / 7);
        let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

        const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota updated
      if (relevantLogEntry.shifttype === "1 Month Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Calculate month lengths with leap year check for a given year
        const calculateMonthLengths = (year) => {
          return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        };

        // Determine the effective month and year for the start date
        let effectiveMonth = startDate.getMonth();
        let effectiveYear = startDate.getFullYear();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
          if (effectiveMonth === 0) {
            effectiveYear += 1; // Move to the next year if month resets
          }
        }

        // Calculate total days for the current two-month cycle
        let totalDays = 0;
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
          const currentYear = effectiveYear + yearAdjustment;
          const monthLengthsForYear = calculateMonthLengths(currentYear);
          totalDays += monthLengthsForYear[monthIndex];
        }

        // Set the endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

        // Recalculate if currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month and year for the next cycle
          effectiveMonth = startDate.getMonth();
          effectiveYear = startDate.getFullYear();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
            if (effectiveMonth === 0) {
              effectiveYear += 1;
            }
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
            const currentYear = effectiveYear + yearAdjustment;
            const monthLengthsForYear = calculateMonthLengths(currentYear);
            totalDays += monthLengthsForYear[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
        }

        // Calculate the difference in days including the start date
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
        let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

        // Define week names for first and second month of the cycle
        const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

        const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
};

const getShiftForDateDayShift = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment, matchingRemovedItem, matchingAssignShiftItem) => {
  // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

  // if (selectedDateIndex === -1) {
  //     return !isWeekOff ? actualShiftTiming : "Week Off";
  // }

  // if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
  //     return `${matchingItem?._doc?.selectedShifTime.split(' - ')[0]}to${matchingItem?._doc?.selectedShifTime.split(' - ')[1]}`;
  // }
  // else
  if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "WeekOff Adjustment") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Adjustment") {
    if (matchingAssignShiftItem && matchingDoubleShiftItem?._doc?.todate === matchingAssignShiftItem?._doc?.adjdate) {
      return `${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    } else {
      return "Not Allotted";
    }
  } else if (matchingRemovedItem && matchingRemovedItem?._doc?.adjstatus === "Not Allotted") {
    return "Not Allotted";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Approved") {
    if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === "Shift Adjustment" || matchingItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
      if (column.shiftMode === "Main Shift") {
        return `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
      } else if (column.shiftMode === "Second Shift") {
        return `${matchingItem?._doc?.pluseshift.split(" - ")[0]}to${matchingItem?._doc?.pluseshift.split(" - ")[1]}`;
      }
    } else {
      return isWeekOffWithAdjustment ? `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}` : `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    }
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
    return isWeekOffWithManual ? `${matchingItemAllot._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} ` : `${matchingItemAllot?._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `;
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
    return "Week Off";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Reject" && isWeekOff) {
    // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    return "Week Off";
  }
  // before add shifttype condition working code
  // else if (boardingLog?.length > 0) {

  //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
  //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

  //     // Filter boardingLog entries for the same start date
  //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

  //     // If there are entries for the date, return the shift timing of the second entry
  //     if (entriesForDate.length > 1) {
  //         return entriesForDate[1].shifttiming;
  //     }

  //     // Find the most recent boarding log entry that is less than or equal to the selected date
  //     const recentLogEntry = boardingLog
  //         .filter(log => log.startdate < finalDate)
  //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

  //     // If a recent log entry is found, return its shift timing
  //     if (recentLogEntry) {
  //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
  //     } else {
  //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
  //         return !isWeekOff ? actualShiftTiming : "Week Off";
  //     }
  // }
  else if (boardingLog.length > 0) {
    // Remove duplicate entries with recent entry
    const uniqueEntries = {};
    boardingLog.forEach((entry) => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date
    const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

    if (relevantLogEntry) {
      // Daily
      if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "Daily") {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      // 2 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "1 Week Rotation") {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

        // Calculate the day count until the next Sunday
        let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number
        const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === "2 Week Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        const currentDate = new Date(finalDate);

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        // Calculate total days for 1-month rotation based on the effective month
        let totalDays = monthLengths[effectiveMonth];

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          // Set startDate to the next matchingDepartment.fromdate for each cycle
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = monthLengths[effectiveMonth];

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
        }

        // Calculate the difference in days correctly
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

        // Calculate the week number within the rotation month based on 7-day intervals from start date
        // const weekNumber = Math.ceil(diffDays / 7);
        let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

        const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota updated
      if (relevantLogEntry.shifttype === "1 Month Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Calculate month lengths with leap year check for a given year
        const calculateMonthLengths = (year) => {
          return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        };

        // Determine the effective month and year for the start date
        let effectiveMonth = startDate.getMonth();
        let effectiveYear = startDate.getFullYear();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
          if (effectiveMonth === 0) {
            effectiveYear += 1; // Move to the next year if month resets
          }
        }

        // Calculate total days for the current two-month cycle
        let totalDays = 0;
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
          const currentYear = effectiveYear + yearAdjustment;
          const monthLengthsForYear = calculateMonthLengths(currentYear);
          totalDays += monthLengthsForYear[monthIndex];
        }

        // Set the endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

        // Recalculate if currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month and year for the next cycle
          effectiveMonth = startDate.getMonth();
          effectiveYear = startDate.getFullYear();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
            if (effectiveMonth === 0) {
              effectiveYear += 1;
            }
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
            const currentYear = effectiveYear + yearAdjustment;
            const monthLengthsForYear = calculateMonthLengths(currentYear);
            totalDays += monthLengthsForYear[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
        }

        // Calculate the difference in days including the start date
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
        let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

        // Define week names for first and second month of the cycle
        const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

        const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
};

const getShiftForDate = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment, matchingRemovedItem, matchingAssignShiftItem) => {
  // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

  // if (selectedDateIndex === -1) {
  //     return !isWeekOff ? actualShiftTiming : "Week Off";
  // }

  //if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
  //  return 'Pending...'
  //}
  //    else
  if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "WeekOff Adjustment") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Adjustment") {
    if (matchingAssignShiftItem && matchingDoubleShiftItem?._doc?.todate === matchingAssignShiftItem?._doc?.adjdate) {
      return `${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingDoubleShiftItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    } else {
      return "Not Allotted";
    }
  } else if (matchingRemovedItem && matchingRemovedItem?._doc?.adjstatus === "Not Allotted") {
    return "Not Allotted";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Approved") {
    if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === "Shift Adjustment" || matchingItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
      if (column.shiftMode === "Main Shift") {
        return `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
      } else if (column.shiftMode === "Second Shift") {
        return `${matchingItem?._doc?.pluseshift.split(" - ")[0]}to${matchingItem?._doc?.pluseshift.split(" - ")[1]}`;
      }
    } else {
      return isWeekOffWithAdjustment ? `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}` : `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    }
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
    return isWeekOffWithManual ? `${matchingItemAllot._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} ` : `${matchingItemAllot?._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `;
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
    return "Week Off";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Reject" && isWeekOff) {
    // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    return "Week Off";
  }
  // before add shifttype condition working code
  // else if (boardingLog?.length > 0) {

  //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
  //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

  //     // Filter boardingLog entries for the same start date
  //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

  //     // If there are entries for the date, return the shift timing of the second entry
  //     if (entriesForDate.length > 1) {
  //         return entriesForDate[1].shifttiming;
  //     }

  //     // Find the most recent boarding log entry that is less than or equal to the selected date
  //     const recentLogEntry = boardingLog
  //         .filter(log => log.startdate < finalDate)
  //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

  //     // If a recent log entry is found, return its shift timing
  //     if (recentLogEntry) {
  //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
  //     } else {
  //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
  //         return !isWeekOff ? actualShiftTiming : "Week Off";
  //     }
  // }
  else if (boardingLog.length > 0) {
    // Remove duplicate entries with recent entry
    const uniqueEntries = {};
    boardingLog.forEach((entry) => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date
    const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

    if (relevantLogEntry) {
      // Daily
      if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "Daily") {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      // 2 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "1 Week Rotation") {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

        // Calculate the day count until the next Sunday
        let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number
        const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === "2 Week Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        const currentDate = new Date(finalDate);

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        // Calculate total days for 1-month rotation based on the effective month
        let totalDays = monthLengths[effectiveMonth];

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          // Set startDate to the next matchingDepartment.fromdate for each cycle
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = monthLengths[effectiveMonth];

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
        }

        // Calculate the difference in days correctly
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

        // Calculate the week number within the rotation month based on 7-day intervals from start date
        // const weekNumber = Math.ceil(diffDays / 7);
        let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

        const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota updated
      if (relevantLogEntry.shifttype === "1 Month Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Calculate month lengths with leap year check for a given year
        const calculateMonthLengths = (year) => {
          return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        };

        // Determine the effective month and year for the start date
        let effectiveMonth = startDate.getMonth();
        let effectiveYear = startDate.getFullYear();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
          if (effectiveMonth === 0) {
            effectiveYear += 1; // Move to the next year if month resets
          }
        }

        // Calculate total days for the current two-month cycle
        let totalDays = 0;
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
          const currentYear = effectiveYear + yearAdjustment;
          const monthLengthsForYear = calculateMonthLengths(currentYear);
          totalDays += monthLengthsForYear[monthIndex];
        }

        // Set the endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

        // Recalculate if currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month and year for the next cycle
          effectiveMonth = startDate.getMonth();
          effectiveYear = startDate.getFullYear();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
            if (effectiveMonth === 0) {
              effectiveYear += 1;
            }
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
            const currentYear = effectiveYear + yearAdjustment;
            const monthLengthsForYear = calculateMonthLengths(currentYear);
            totalDays += monthLengthsForYear[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
        }

        // Calculate the difference in days including the start date
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
        let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

        // Define week names for first and second month of the cycle
        const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

        const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
};

const getShiftForDateProdDayShift = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment) => {
  // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

  // if (selectedDateIndex === -1) {
  //     return !isWeekOff ? actualShiftTiming : "Week Off";
  // }

  // if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
  //     return 'Pending...'
  // }
  // else
  if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "WeekOff Adjustment") {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Approved") {
    if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === "Shift Adjustment" || matchingItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
      if (column.shiftMode === "Main Shift") {
        return `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
      } else if (column.shiftMode === "Second Shift") {
        return `${matchingItem?._doc?.pluseshift.split(" - ")[0]}to${matchingItem?._doc?.pluseshift.split(" - ")[1]}`;
      }
    } else {
      return isWeekOffWithAdjustment ? `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}` : `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]}`;
    }
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
    return isWeekOffWithManual ? `${matchingItemAllot._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} ` : `${matchingItemAllot?._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `;
  } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
    return "Week Off";
  } else if (matchingItem && matchingItem?._doc?.adjstatus === "Reject" && isWeekOff) {
    // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    return "Week Off";
  }
  // before add shifttype condition working code
  // else if (boardingLog?.length > 0) {

  //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
  //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

  //     // Filter boardingLog entries for the same start date
  //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

  //     // If there are entries for the date, return the shift timing of the second entry
  //     if (entriesForDate.length > 1) {
  //         return entriesForDate[1].shifttiming;
  //     }

  //     // Find the most recent boarding log entry that is less than or equal to the selected date
  //     const recentLogEntry = boardingLog
  //         .filter(log => log.startdate < finalDate)
  //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

  //     // If a recent log entry is found, return its shift timing
  //     if (recentLogEntry) {
  //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
  //     } else {
  //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
  //         return !isWeekOff ? actualShiftTiming : "Week Off";
  //     }
  // }
  else if (boardingLog.length > 0) {
    // Remove duplicate entries with recent entry
    const uniqueEntries = {};
    boardingLog.forEach((entry) => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date
    const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

    if (relevantLogEntry) {
      // Daily
      if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "Daily") {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      // 2 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === "1 Week Rotation") {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

        // Calculate the day count until the next Sunday
        let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number
        const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === "2 Week Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        const currentDate = new Date(finalDate);

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        // Calculate total days for 1-month rotation based on the effective month
        let totalDays = monthLengths[effectiveMonth];

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          // Set startDate to the next matchingDepartment.fromdate for each cycle
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = monthLengths[effectiveMonth];

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
        }

        // Calculate the difference in days correctly
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

        // Calculate the week number within the rotation month based on 7-day intervals from start date
        // const weekNumber = Math.ceil(diffDays / 7);
        let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

        const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota updated
      if (relevantLogEntry.shifttype === "1 Month Rotation") {
        const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Calculate month lengths with leap year check for a given year
        const calculateMonthLengths = (year) => {
          return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        };

        // Determine the effective month and year for the start date
        let effectiveMonth = startDate.getMonth();
        let effectiveYear = startDate.getFullYear();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
          if (effectiveMonth === 0) {
            effectiveYear += 1; // Move to the next year if month resets
          }
        }

        // Calculate total days for the current two-month cycle
        let totalDays = 0;
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
          const currentYear = effectiveYear + yearAdjustment;
          const monthLengthsForYear = calculateMonthLengths(currentYear);
          totalDays += monthLengthsForYear[monthIndex];
        }

        // Set the endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

        // Recalculate if currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month and year for the next cycle
          effectiveMonth = startDate.getMonth();
          effectiveYear = startDate.getFullYear();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
            if (effectiveMonth === 0) {
              effectiveYear += 1;
            }
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
            const currentYear = effectiveYear + yearAdjustment;
            const monthLengthsForYear = calculateMonthLengths(currentYear);
            totalDays += monthLengthsForYear[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
        }

        // Calculate the difference in days including the start date
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

        // Determine the start day of the first week
        let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Adjust the start day so that Monday is considered the start of the week
        let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Calculate the week number based on Monday to Sunday cycle
        let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
        let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

        // Define week names for first and second month of the cycle
        const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

        const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
};

const getTotalMonthDaysUser = (rowdepartment, depMonthSet, ismonth, isyear) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const totalDaysInMonth = new Date(isyear, ismonth, 0).getDate();

  // const depdays = depMonthSet && depMonthSet?.find((d) => d.department === rowdepartment && Number(d.month) === ismonth && Number(d.year) === isyear);
  const depdays = depMonthSet && depMonthSet?.find((d) => d.department === rowdepartment && d.monthname === monthNames[ismonth - 1] && Number(d.year) === isyear);

  if (depdays) {
    return depdays.totaldays;
  }

  return totalDaysInMonth;
};

// get total working days from dep month set
const getTotalMonthDaysForEmpUser = (rowdoj, rowdepartment, depMonthSet, ismonth, isyear) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (!rowdoj) {
    return "";
  }

  const [year, month, day] = rowdoj.split("-").map(Number);
  const joiningDate = new Date(year, month - 1, day);

  let totalDays = 0;

  // const depdays = depMonthSet && depMonthSet?.filter((d) => d.department === rowdepartment && Number(d.month) === ismonth && Number(d.year) === isyear);
  const depdays = depMonthSet && depMonthSet?.filter((d) => d.department === rowdepartment && d.monthname === monthNames[ismonth - 1] && Number(d.year) === isyear);

  if (depdays && depdays.length > 0) {
    depdays.forEach((dep) => {
      const fromDate = new Date(dep.fromdate);
      const toDate = new Date(dep.todate);
      if (joiningDate < fromDate) {
        // If the joining date is before the department's fromdate
        // const daysToFromdate = Math.ceil((fromDate - joiningDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the starting day
        // const daysInDepartment = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the ending day
        // totalDays += Math.min(daysToFromdate, daysInDepartment);
        const daysInDepartment = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment + (dep.todate === rowdoj ? 0 : 1);
      } else {
        // If the joining date is after the department's fromdate
        // totalDays += Math.ceil((toDate - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        const daysInDepartment = Math.ceil((toDate - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment + (dep.todate === rowdoj ? 0 : 0);
      }
    });
  } else {
    // Logic to handle when no department data is found for the current month
    // Calculate total days based on the current month's start and end dates
    const startDateOfMonth = new Date(isyear, ismonth - 1, 1);
    const endDateOfMonth = new Date(isyear, ismonth, 0);
    if (joiningDate < startDateOfMonth) {
      // If the joining date is before the department's fromdate
      // const daysToFromdate = Math.ceil((startDateOfMonth - joiningDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the starting day
      // const daysInDepartment = Math.ceil((endDateOfMonth - startDateOfMonth) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the ending day
      // totalDays += Math.min(daysToFromdate, daysInDepartment);
      const daysInDepartment = Math.ceil((endDateOfMonth - startDateOfMonth) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
      totalDays += daysInDepartment + (endDateOfMonth === joiningDate ? 0 : 1);
    } else {
      // totalDays += Math.ceil((endDateOfMonth - startDateOfMonth) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the ending day
      const daysInDepartment = Math.ceil((endDateOfMonth - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
      totalDays += daysInDepartment + (endDateOfMonth === joiningDate ? 0 : 1);
    }
  }

  return Math.max(0, totalDays); // Ensure totalDays is not negative
};

// get till date count based on the dep month and joining date till current date of enddate
const getTotalMonthsCurrentDateCountUser = (rowdoj, rowdepartment, depMonthSet, ismonth, isyear) => {
  if (!rowdoj) {
    return "";
  }

  const [year, month, day] = rowdoj?.split("-").map(Number);
  const joiningDate = new Date(year, month - 1, day);
  const currentDate = new Date(isyear, ismonth - 1);

  let totalDays = 0;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // const depdays = depMonthSet?.filter((d) => d.department === rowdepartment && Number(d.month) === ismonth && Number(d.year) === isyear);

  const depdays = depMonthSet?.filter((d) => d.department === rowdepartment && d.monthname === monthNames[ismonth - 1] && Number(d.year) === isyear);

  if (depdays && depdays.length > 0) {
    depdays.forEach((dep) => {
      const fromDate = new Date(dep.fromdate);
      const toDate = new Date(dep.todate);

      // Adjust the time to midnight for joiningDate and toDate
      joiningDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);

      if (joiningDate < fromDate) {
        if (toDate >= currentDateAttStatus) {
          // If the joining date is before the department's fromdate
          const daysInDepartment = Math.ceil((currentDateAttStatus - fromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment;
        } else if (toDate <= currentDateAttStatus) {
          // If the joining date is before the department's fromdate
          const daysInDepartment = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment + 1;
        }
      } else {
        if (toDate >= currentDateAttStatus) {
          // If the joining date is after or on the department's fromdate and toDate is greater than or equal to currentDate
          const daysInDepartment = Math.ceil((currentDateAttStatus - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment;
        } else if (toDate <= currentDateAttStatus) {
          // If the joining date is after or on the department's fromdate and toDate is less than or equal to currentDate
          const daysInDepartment = Math.ceil((toDate - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment + (toDate === joiningDate ? 0 : 1);
        }
      }
    });
  } else {
    // Calculate the start date of the month based on the selected month
    const monthfromDate = new Date(isyear, ismonth - 1, 1);
    const monthEndDate = new Date(monthfromDate);
    monthEndDate.setMonth(monthEndDate.getMonth() + 1);
    monthEndDate.setDate(monthEndDate.getDate() - 1);

    if (joiningDate < monthfromDate) {
      if (monthEndDate >= currentDateAttStatus) {
        // If the joining date is before the department's fromdate
        const daysInDepartment = Math.ceil((currentDateAttStatus - monthfromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment;
      } else if (monthEndDate <= currentDateAttStatus) {
        // If the joining date is before the department's fromdate
        const daysInDepartment = Math.ceil((monthEndDate - monthfromDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the ending day
        totalDays += daysInDepartment;
      }
    } else {
      if (monthEndDate >= currentDateAttStatus) {
        // If the joining date is after or on the department's fromdate and toDate is greater than or equal to currentDate
        const daysInDepartment = Math.ceil((currentDateAttStatus - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment;
      } else if (monthEndDate <= currentDateAttStatus) {
        // If the joining date is after or on the department's fromdate and toDate is less than or equal to currentDate
        const daysInDepartment = Math.ceil((monthEndDate - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment;
      }
    }
  }

  // Check if totalDays is negative and return 0 in that case
  return totalDays < 0 ? 0 : totalDays;
};

const getTotalMonthsCurrentDateCountUserPayrun = (rowdoj, rowdepartment, depMonthSet, ismonth, isyear, reasondate) => {
  if (!rowdoj) {
    return "";
  }

  const [year, month, day] = rowdoj?.split("-").map(Number);
  const joiningDate = new Date(year, month - 1, day);
  const currentDate = new Date(isyear, ismonth - 1);

  let totalDays = 0;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // const depdays = depMonthSet?.filter((d) => d.department === rowdepartment && Number(d.month) === ismonth && Number(d.year) === isyear);

  const depdays = depMonthSet?.filter((d) => d.department === rowdepartment && d.monthname === monthNames[ismonth - 1] && Number(d.year) === isyear);
  const depdaysSingle = depMonthSet && depMonthSet?.find((d) => d.department === rowdepartment && d.monthname === monthNames[ismonth - 1] && Number(d.year) === isyear);

  // console.log(reasondate, "reasondate");
  if (reasondate != "" && reasondate != undefined && reasondate != null) {
    const getDatesInRange = (fromDate, toDate) => {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Add one day to include the end date
      endDate.setDate(endDate.getDate() + 1);

      let count = 0;
      for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
        count++;
      }

      return count;
    };
    //FIND MONTH FIRSTDATE
    const monthIndex = new Date(`${monthNames[ismonth - 1]} 1, ${isyear}`).getMonth();
    const monthStartdate = `${isyear}-${String(monthIndex + 1).padStart(2, "0")}-01`;
    const fromdate = depdaysSingle ? depdaysSingle.fromdate : monthStartdate;

    //FIND MONTH LASTDATE
    const monthIndexLastDate = new Date(`${monthNames[ismonth - 1]} 1, ${year}`).getMonth();
    // Create a Date object for the first day of the next month
    const nextMonth = new Date(year, monthIndexLastDate + 1, 1);
    // Subtract one day to get the last day of the current month
    const lastDayOfMonth = new Date(nextMonth - 1);
    // Format the date as "YYYY-MM-DD"
    const monthEndDate = lastDayOfMonth.toISOString().split("T")[0];

    const deptMonthEndDate = depdaysSingle ? depdaysSingle.todate : monthEndDate;
    const todayDateNow = new Date().toISOString().split("T")[0];
    const endDateFinal = new Date(reasondate) > new Date(deptMonthEndDate) ? (new Date(deptMonthEndDate) > new Date() ? todayDateNow : deptMonthEndDate) : reasondate;
    const finalFromdate = new Date(rowdoj) > new Date(fromdate) ? rowdoj : fromdate;
    // console.log(monthEndDate, endDateFinal, 'tnodate');
    const tond = getDatesInRange(finalFromdate, endDateFinal);
    // console.log(tond, 'tond');
    return tond;
  } else if (depdays && depdays.length > 0) {
    depdays.forEach((dep) => {
      const fromDate = new Date(dep.fromdate);
      const toDate = new Date(dep.todate);

      // Adjust the time to midnight for joiningDate and toDate
      joiningDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);

      if (joiningDate < fromDate) {
        if (toDate >= currentDateAttStatus) {
          // If the joining date is before the department's fromdate
          const daysInDepartment = Math.ceil((currentDateAttStatus - fromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment;
        } else if (toDate <= currentDateAttStatus) {
          // If the joining date is before the department's fromdate
          const daysInDepartment = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment + 1;
        }
      } else {
        if (toDate >= currentDateAttStatus) {
          // If the joining date is after or on the department's fromdate and toDate is greater than or equal to currentDate
          const daysInDepartment = Math.ceil((currentDateAttStatus - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment;
        } else if (toDate <= currentDateAttStatus) {
          // If the joining date is after or on the department's fromdate and toDate is less than or equal to currentDate
          const daysInDepartment = Math.ceil((toDate - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
          totalDays += daysInDepartment + (toDate === joiningDate ? 0 : 1);
        }
      }
    });
  } else {
    // Calculate the start date of the month based on the selected month
    const monthfromDate = new Date(isyear, ismonth - 1, 1);
    const monthEndDate = new Date(monthfromDate);
    monthEndDate.setMonth(monthEndDate.getMonth() + 1);
    monthEndDate.setDate(monthEndDate.getDate() - 1);
    // console.log(joiningDate, monthfromDate, 'monthfromDate');
    if (joiningDate < monthfromDate) {
      if (monthEndDate >= currentDateAttStatus) {
        // If the joining date is before the department's fromdate
        const daysInDepartment = Math.ceil((currentDateAttStatus - monthfromDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment;
      } else if (monthEndDate <= currentDateAttStatus) {
        // If the joining date is before the department's fromdate
        const daysInDepartment = Math.ceil((monthEndDate - monthfromDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the ending day
        totalDays += daysInDepartment;
      }
    } else {
      if (monthEndDate >= currentDateAttStatus) {
        // If the joining date is after or on the department's fromdate and toDate is greater than or equal to currentDate
        const daysInDepartment = Math.ceil((currentDateAttStatus - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment;
      } else if (monthEndDate <= currentDateAttStatus) {
        // If the joining date is after or on the department's fromdate and toDate is less than or equal to currentDate
        const daysInDepartment = Math.ceil((monthEndDate - joiningDate) / (1000 * 60 * 60 * 24)); // Add 1 to include the ending day
        totalDays += daysInDepartment;
      }
    }
  }
  // console.log(totalDays, 'totalDays');

  // Check if totalDays is negative and return 0 in that case
  return totalDays < 0 ? 0 : totalDays;
};

const getTotalShiftHoursUser = (rowuserid, userDates, attendance) => {
  let totalShiftCount = 0;

  const totalShiftDays = attendance?.filter((d) => d.userid === rowuserid && d.status === true);
  if (totalShiftDays) {
    // Maintain a set to keep track of unique dates
    const countedDates = new Set();

    userDates &&
      userDates?.forEach((date) => {
        totalShiftDays.find((att) => {
          if (att.date === moment(date.formattedDate, "DD/MM/YYYY").format("DD-MM-YYYY") && !countedDates.has(att.date)) {
            // If the date matches and it's not already counted, increment totalShiftCount
            totalShiftCount++;
            countedDates.add(att.date); // Add the date to the set to mark it as counted
          }
        });
      });
  }

  return totalShiftCount;
};

//attendance checklist
const checkAttendanceStatus = (attendance, rowuserid, rowdate, rowshiftmode) => {
  const attendanceRecord = attendance?.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  // Check if attendanceRecord exists and its attendancestatus is not undefined
  if (attendanceRecord && attendanceRecord.attendancestatus !== undefined) {
    return attendanceRecord.attendancestatus;
  }
  // Return a default value if attendanceRecord or attendancestatus is not available
  return "";
};

//attendance weekoff present
const checkWeekOffPresentStatus = (attendance, rowuserid, rowdate, rowshiftmode) => {
  const attendanceRecord = attendance?.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode && d.weekoffpresentstatus === true);

  // Check if attendanceRecord exists and its attendancestatus is not undefined
  if (attendanceRecord && attendanceRecord.weekoffpresentstatus !== undefined) {
    return attendanceRecord.weekoffpresentstatus;
  }
  // Return a default value if attendanceRecord or attendancestatus is not available
  return "";
};

const calculateShiftWorkingHours = (shifttime) => {
  if (shifttime !== "Week Off" && shifttime !== "Not Allotted" && shifttime !== undefined && shifttime !== "undefined" && shifttime !== "") {
    // Parse start and end times
    const startTime = parseTime(shifttime?.split("to")[0]);
    const endTime = parseTime(shifttime?.split("to")[1]);
    let startTimeWithPM = shifttime?.split("to")[0];

    // Function to calculate hours, minutes, and seconds
    const calculateTimeDifference = (start, end) => {
      const diffInMs = end - start;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

      // Ensure two-digit formatting for hours, minutes, and seconds
      const formattedHours = String(diffInHours).padStart(2, "0");
      const formattedMinutes = String(diffInMinutes).padStart(2, "0");
      const formattedSeconds = String(diffInSeconds).padStart(2, "0");

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    if (startTimeWithPM?.includes("PM")) {
      // Handle shifts that span midnight
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1); // Move end time to the next day
      }

      // Return the formatted time difference with hours, minutes, and seconds
      return calculateTimeDifference(startTime, endTime);
    } else {
      // Return the formatted time difference with hours, minutes, and seconds
      return calculateTimeDifference(startTime, endTime);
    }
  } else {
    return "00:00:00";
  }
};

const calculateShiftBeforeOtHours = (shifttime, clockintime, isBeforeEnable, BeforeTime) => {
  if (shifttime !== "Week Off" && shifttime !== "Not Allotted" && shifttime !== undefined && shifttime !== "undefined" && shifttime !== "") {
    if (clockintime !== "00:00:00") {
      // Parse shift start time, clock-in time, and calculate compareBeforeTime
      const shiftStartTime = parseTime(shifttime?.split("to")[0]);
      const clockInTime = parseTime(clockintime);

      // Calculate the "before time" by subtracting BeforeTime (in minutes) from shiftStartTime
      const beforeTimeInMilliseconds = BeforeTime * 60000;
      const compareBeforeTime = new Date(shiftStartTime?.getTime() - beforeTimeInMilliseconds);

      // Check if before time feature is enabled
      if (isBeforeEnable) {
        // If clock-in time is before compareBeforeTime, calculate overtime
        if (clockInTime < compareBeforeTime) {
          const overtimeInMs = compareBeforeTime - clockInTime;

          // Convert milliseconds to hours, minutes, and seconds
          const overtimeHours = Math.floor(overtimeInMs / (1000 * 60 * 60));
          const overtimeMinutes = Math.floor((overtimeInMs % (1000 * 60 * 60)) / (1000 * 60));
          const overtimeSeconds = Math.floor((overtimeInMs % (1000 * 60)) / 1000);

          // Ensure two-digit formatting for hours, minutes, and seconds
          const formattedOvertimeHours = String(overtimeHours).padStart(2, "0");
          const formattedOvertimeMinutes = String(overtimeMinutes).padStart(2, "0");
          const formattedOvertimeSeconds = String(overtimeSeconds).padStart(2, "0");

          // Return overtime in HH:MM:SS format
          return `${formattedOvertimeHours}:${formattedOvertimeMinutes}:${formattedOvertimeSeconds}`;
        } else {
          return "00:00:00";
        }
      } else {
        return "00:00:00";
      }
    } else {
      return "00:00:00";
    }
  } else {
    return "00:00:00";
  }
};

const calculateShiftAfterOtHours = (shifttime, clockouttime, isAfterEnable, AfterTime) => {
  if (shifttime !== "Week Off" && shifttime !== "Not Allotted" && shifttime !== undefined && shifttime !== "undefined" && shifttime !== "") {
    if (clockouttime !== "00:00:00") {
      // Parse shift end time, clock-out time, and calculate compareAfterTime
      const shiftEndTime = parseTime(shifttime?.split("to")[1]);
      const clockOutTime = parseTime(clockouttime);

      // Calculate the "after time" by adding AfterTime (in minutes) to shiftEndTime
      const afterTimeInMilliseconds = AfterTime * 60000;
      const compareAfterTime = new Date(shiftEndTime?.getTime() + afterTimeInMilliseconds);

      // Check if after time feature is enabled
      if (isAfterEnable) {
        // If clock-out time is after compareAfterTime, calculate overtime
        if (clockOutTime > compareAfterTime) {
          const overtimeInMs = clockOutTime - compareAfterTime;

          // Convert milliseconds to hours, minutes, and seconds
          const overtimeHours = Math.floor(overtimeInMs / (1000 * 60 * 60));
          const overtimeMinutes = Math.floor((overtimeInMs % (1000 * 60 * 60)) / (1000 * 60));
          const overtimeSeconds = Math.floor((overtimeInMs % (1000 * 60)) / 1000);

          // Ensure two-digit formatting for hours, minutes, and seconds
          const formattedOvertimeHours = String(overtimeHours).padStart(2, "0");
          const formattedOvertimeMinutes = String(overtimeMinutes).padStart(2, "0");
          const formattedOvertimeSeconds = String(overtimeSeconds).padStart(2, "0");

          // Return overtime in HH:MM:SS format
          return `${formattedOvertimeHours}:${formattedOvertimeMinutes}:${formattedOvertimeSeconds}`;
        } else {
          return "00:00:00";
        }
      } else {
        return "00:00:00";
      }
    } else {
      return "00:00:00";
    }
  } else {
    return "00:00:00";
  }
};

const calculateTotalOtHours = (beforeOtTime, afterOtTime) => {
  // Function to convert HH:MM:SS format into total seconds
  const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
  };

  // Convert seconds back to HH:MM:SS format
  const secondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Convert both times to total seconds
  const beforeSeconds = timeToSeconds(beforeOtTime);
  const afterSeconds = timeToSeconds(afterOtTime);

  // Sum the seconds
  const totalSeconds = beforeSeconds + afterSeconds;

  // Convert total seconds back to HH:MM:SS format
  return secondsToTime(totalSeconds);
};

const calculateAfterShiftShortHours = (shifttime, clockintime) => {
  if (shifttime !== "Week Off" && shifttime !== "Not Allotted" && shifttime !== undefined && shifttime !== "undefined" && shifttime !== "" && clockintime !== "00:00:00") {
    // Parse shift start time and clock-in time
    const shiftStartTime = parseTime(shifttime.split("to")[0].trim());
    const clockInTime = parseTime(clockintime);

    // If the user clocked in after the shift start time, calculate short time
    if (clockInTime > shiftStartTime) {
      const shortTimeInMs = clockInTime - shiftStartTime;

      // Convert milliseconds to hours, minutes, and seconds
      const shortHours = Math.floor(shortTimeInMs / (1000 * 60 * 60));
      const shortMinutes = Math.floor((shortTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
      const shortSeconds = Math.floor((shortTimeInMs % (1000 * 60)) / 1000);

      // Ensure two-digit formatting for hours, minutes, and seconds
      const formattedHours = String(shortHours).padStart(2, "0");
      const formattedMinutes = String(shortMinutes).padStart(2, "0");
      const formattedSeconds = String(shortSeconds).padStart(2, "0");

      // Return short time in HH:MM:SS format
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return "00:00:00";
    }
  } else {
    return "00:00:00";
  }
};

const calculateBeforeShiftShortHours = (shifttime, clockouttime) => {
  if (shifttime !== "Week Off" && shifttime !== "Not Allotted" && shifttime && shifttime !== "undefined" && clockouttime !== "00:00:00") {
    const startTime = parseTime(shifttime?.split("to")[0].trim());
    let shiftEndTime = parseTime(shifttime?.split("to")[1].trim());
    let clockOutTime = parseTime(clockouttime);
    const startTimePeriod = shifttime?.split("to")[0].includes("PM") ? "PM" : "AM";

    // Adjust dates based on shift type and clockout time
    if (startTimePeriod === "AM" && clockouttime.includes("AM")) {
      // Day shift: Start AM, ClockOut AM -> Add 1 day to ClockOut
      clockOutTime.setDate(clockOutTime.getDate() + 1);
    } else if (startTimePeriod === "PM" && clockouttime.includes("AM")) {
      // Night shift: Start PM, ClockOut AM -> Add 1 day to ClockOut
      clockOutTime.setDate(clockOutTime.getDate() + 1);
    } else if (startTimePeriod === "PM" && clockouttime.includes("PM") && shiftEndTime < startTime) {
      // Night shift: Start PM, ClockOut PM but shift crosses midnight
      shiftEndTime.setDate(shiftEndTime.getDate() + 1);
    }
    // Check if clock out was before shift end
    if (clockOutTime < shiftEndTime) {
      const shortTimeInMs = shiftEndTime - clockOutTime;

      const shortHours = Math.floor(shortTimeInMs / (1000 * 60 * 60));
      const shortMinutes = Math.floor((shortTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
      const shortSeconds = Math.floor((shortTimeInMs % (1000 * 60)) / 1000);

      const formattedHours = String(shortHours).padStart(2, "0");
      const formattedMinutes = String(shortMinutes).padStart(2, "0");
      const formattedSeconds = String(shortSeconds).padStart(2, "0");

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return "00:00:00";
    }
  } else {
    return "00:00:00";
  }
};
const calculateTotalShortHours = (shiftAfterShortTime, shiftBeforeShortTime) => {
  // Function to convert HH:MM:SS format into total seconds
  const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
  };

  // Convert seconds back to HH:MM:SS format
  const secondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Convert both times to total seconds
  const afterSeconds = timeToSeconds(shiftAfterShortTime);
  const beforeSeconds = timeToSeconds(shiftBeforeShortTime);

  // Sum the seconds
  const totalSeconds = afterSeconds + beforeSeconds;

  // Convert total seconds back to HH:MM:SS format
  return secondsToTime(totalSeconds);
};

//total employee hierarchy based

exports.getDashboardtHierarchyTeam = catchAsyncErrors(async (req, res, next) => {
  let result,
    hierarchy,
    resultAccessFilter,
    hierarchyfilter,
    reportingtobaseduser,
    filteredoverall,
    hierarchySecond,
    hierarchyMap,
    resulted,
    resultedTeam,
    hierarchyFinal,
    hierarchyDefault;

  try {
    const { listpageaccessmode } = req.body;

    let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector];

    if (listpageaccessmode === "Reporting to Based") {
      let usersss = await Users.find(
        {
          enquirystatus: {
            $nin: ["Enquiry Purpose"],
          },
          resonablestatus: {
            $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
          },
          reportingto: req.body.username,
        },
        {
          empcode: 1,
          companyname: 1,
        }
      ).lean();
    }

    result = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },
        // resonablestatus: {
        //   $nin: ["Releave Employee", "Absconded", "Hold", "Terminate"],
        // },
      },
      {
        companyname: 1,
        branch: 1,
        company: 1,
        unit: 1,
        team: 1,
        department: 1,
        originalpassword: 1,
        resonablestatus: 1,
        username: 1,
        // _id: 1
      }
    );

    //myhierarchy dropdown
    if (req.body.hierachy === "myhierarchy" && (listpageaccessmode === "Hierarchy Based" || listpageaccessmode === "Overall")) {
      hierarchy = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: req.body.sector,
      });
      hierarchyDefault = await Hirerarchi.find({
        supervisorchoose: req.body.username,
      });

      let answerDef = hierarchyDefault.map((data) => data.employeename);

      hierarchyFinal =
        req.body.sector === "all"
          ? answerDef.length > 0
            ? [].concat(...answerDef)
            : []
          : hierarchy.length > 0
          ? [].concat(...hierarchy.map((item) => item.employeename))
          : [];
      hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

      hierarchyfilter = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: "Primary",
      });
      resulted = result.filter((data) => hierarchyMap.includes(data.companyname));
    }
    // all hierarchy list dropdown
    if (req.body.hierachy === "allhierarchy" && (listpageaccessmode === "Hierarchy Based" || listpageaccessmode === "Overall")) {
      hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });

      let sectorFinal = req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector];

      hierarchyDefault = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: { $in: sectorFinal },
      });

      let answerDef = hierarchyDefault.map((data) => data.employeename).flat();

      function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
        const filteredData = hierarchySecond.filter((item) =>
          item.supervisorchoose.some((supervisor) => currentSupervisors.includes(supervisor) && !processedSupervisors.has(supervisor))
        );

        if (filteredData.length === 0) {
          return result;
        }

        const newEmployees = filteredData.reduce((employees, item) => {
          employees.push(...item.employeename);
          processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
          return employees;
        }, []);

        const uniqueNewEmployees = [...new Set(newEmployees)];
        result = [...result, ...filteredData];

        return findEmployeesRecursive(uniqueNewEmployees, processedSupervisors, result);
      }

      const processedSupervisors = new Set();
      const filteredOverallItem = findEmployeesRecursive(answerDef, processedSupervisors, []);
      let answerDeoverall = filteredOverallItem
        .filter((data) => (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(data.level) : data.level == req.body.sector))
        .map((item) => item.employeename[0]);

      resultedTeam = result.filter((data) => answerDeoverall.includes(data.companyname));

      let hierarchyallfinal = await Hirerarchi.find({
        employeename: { $in: answerDeoverall.map((item) => item) },
        level: req.body.sector,
      });
      hierarchyFinal =
        req.body.sector === "all"
          ? answerDeoverall.length > 0
            ? [].concat(...answerDeoverall)
            : []
          : hierarchyallfinal.length > 0
          ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
          : [];
    }
    //my + all hierarchy list dropdown
    if (req.body.hierachy === "myallhierarchy" && (listpageaccessmode === "Hierarchy Based" || listpageaccessmode === "Overall")) {
      hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });

      let sectorFinal = req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector];

      hierarchyDefault = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: { $in: sectorFinal },
      });

      let answerDef = hierarchyDefault.map((data) => data.employeename);

      function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
        const filteredData = hierarchySecond.filter((item) =>
          item.supervisorchoose.some(
            (supervisor) =>
              currentSupervisors.includes(supervisor) &&
              (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
              !processedSupervisors.has(supervisor)
          )
        );

        if (filteredData.length === 0) {
          return result;
        }

        const newEmployees = filteredData.reduce((employees, item) => {
          employees.push(...item.employeename);
          processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
          return employees;
        }, []);

        const uniqueNewEmployees = [...new Set(newEmployees)];
        result = [...result, ...filteredData];

        return findEmployeesRecursive(uniqueNewEmployees, processedSupervisors, result);
      }

      const processedSupervisors = new Set();
      const filteredOverallItem = findEmployeesRecursive([req.body.username], processedSupervisors, []);
      let answerDeoverall = filteredOverallItem
        .filter((data) => (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(data.level) : data.level == req.body.sector))
        .map((item) => item.employeename[0]);

      filteredoverall = result.filter((data) => answerDeoverall.includes(data.companyname));
    }

    if (listpageaccessmode === "Reporting to Based") {
      reportingtobaseduser = result;
    }

    let finalsupervisor =
      req.body.hierachy == "myhierarchy"
        ? resulted?.map((Data) => Data?.companyname)
        : req.body.hierachy == "allhierarchy"
        ? resultedTeam?.map((Data) => Data?.companyname)
        : filteredoverall?.map((Data) => Data?.companyname);

    const restrictTeam = await Hirerarchi.aggregate([
      {
        $match: {
          $or: [
            {
              supervisorchoose: { $in: finalsupervisor }, // Matches if supervisorchoose field has a value in finalsupervisor
            },
            {
              employeename: { $in: finalsupervisor }, // Matches if employeename field has a value in finalsupervisor
            },
          ],
          level: { $in: levelFinal }, // Matches if level field has a value in levelFinal
        },
      },
      {
        $lookup: {
          from: "reportingheaders",
          let: {
            teamControlsArray: {
              $ifNull: ["$pagecontrols", []],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ["$name", "$$teamControlsArray"],
                    }, // Check if 'name' is in 'teamcontrols' array
                    {
                      $in: [
                        req?.body?.pagename,
                        "$reportingnew", // Check if 'menuteamloginstatus' is in 'reportingnew' array
                      ],
                    }, // Additional condition for reportingnew array
                  ],
                },
              },
            },
          ],
          as: "reportData", // The resulting matched documents will be in this field
        },
      },
      {
        $project: {
          supervisorchoose: 1,
          employeename: 1,
          reportData: 1,
        },
      },
    ]);
    //  console.log(filteredoverall, "filteredoverall");
    let restrictListTeam = restrictTeam?.filter((data) => data?.reportData?.length > 0)?.flatMap((Data) => Data?.employeename);
    const resultAccessFilterHierarchy =
      req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
    resultAccessFilter =
      restrictListTeam?.length > 0
        ? resultAccessFilterHierarchy?.filter((data) => restrictListTeam?.includes(data?.companyname)).map((d) => d.companyname)
        : [];
    // console.log(filteredoverall.length, resultAccessFilter, "filteredoverall");
  } catch (err) {
    console.log(err, "err");
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    resultAccessFilter,
  });
});

//total employee list
exports.getUserWithStatusHomeCountListTeam = catchAsyncErrors(async (req, res, next) => {
    let finalarray;

    try {
        const {
            pageName,
            company,
            branch,
            unit,
            team,
            department,
            employee,
            profileimage,
        } = req.body;

        // Define the past 3 days range
        const today = moment();
        const pastThreeAttendaysDays = [
            today.clone().format("DD-MM-YYYY"),
            today.clone().subtract(1, "days").format("DD-MM-YYYY"),
            today.clone().subtract(2, "days").format("DD-MM-YYYY"),
            today.clone().subtract(3, "days").format("DD-MM-YYYY"),
        ];
        const pastThreeLeaveDays = [
            today.clone().format("DD/MM/YYYY"),
            today.clone().subtract(1, "days").format("DD/MM/YYYY"),
            today.clone().subtract(2, "days").format("DD/MM/YYYY"),
            today.clone().subtract(3, "days").format("DD/MM/YYYY"),
        ];
        const pastThreeDaysISO = [
            today.clone().format("YYYY-MM-DD"),
            today.clone().subtract(1, "days").format("YYYY-MM-DD"),
            today.clone().subtract(2, "days").format("YYYY-MM-DD"),
            today.clone().subtract(3, "days").format("YYYY-MM-DD"),
        ];
        // Fetch relevant attendance records for the past 3 days
        let filterQuery = {
            enquirystatus: {
                $nin: ["Enquiry Purpose"],
            },
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

            // Conditional company filter
            ...(company.length && { company: { $in: company } }),
            // Conditional branch filter
            ...(branch.length && { branch: { $in: branch } }),
            // Conditional unit filter
            ...(unit.length && { unit: { $in: unit } }),
            // Conditional team filter
            ...(team.length && { team: { $in: team } }),
            // Conditional department filter
            ...(department.length && { department: { $in: department } }),
            // Conditional employee filter
            ...(employee.length && { companyname: { $in: employee } }),
        };

        if (pageName === "Employee") {
            filterQuery.workmode = {
                $ne: "Internship",
            };
        } else if (pageName === "Internship") {
            filterQuery.workmode = {
                $eq: "Internship",
            };
        }

        const noticeperiodpipeline = [
            {
                // Sort by empname and then by createdAt in descending order
                $sort: { empname: 1, createdAt: -1 },
            },
            {
                // Group by empname and select the first document per group (most recent)
                $group: {
                    _id: "$empname", // Group by empname
                    mostRecentDocument: { $first: "$$ROOT" }, // Select the most recent document per empname
                },
            },
            {
                // Project the necessary fields from the most recent document
                $replaceRoot: { newRoot: "$mostRecentDocument" },
            },
            {
                $match: {
                    $or: [
                        {
                            exitstatus: true,
                        },
                        // Condition for "Approved" status
                        {
                            approvedStatus: "true",
                            cancelstatus: false,
                        },
                        // Condition for "Applied" status
                        {
                            status: "Applied",
                        },
                    ],
                    // Add the new conditions
                    rejectStatus: { $ne: "true" },
                    cancelstatus: { $ne: true },
                    continuestatus: { $ne: true },
                },
            },
            {
                $project: {
                    empname: 1,
                    empcode: 1,
                    status: 1,
                    rejectStatus: 1,
                    cancelstatus: 1,
                    approvedStatus: 1,
                    continuestatus: 1,
                    recheckStatus: 1,
                    exitstatus: 1,
                    createdAt: 1,
                },
            },
        ];
        // Run all queries in parallel using Promise.all
        const [allusers, attendance, allLeaveStatus, holidays, noticeperiodstatus] =
            await Promise.all([
                User.find(filterQuery, {
                    status: 1,
                    empcode: 1,
                    nexttime: 1,
                    companyname: 1,
                    username: 1,
                    email: 1,
                    employeecount: 1,
                    systemmode: 1,
                    companyemail: 1,
                    branch: 1,
                    unit: 1,
                    team: 1,
                    company: 1,
                    shift: 1,
                    experience: 1,
                    doj: 1,
                    dot: 1,
                    workmode: 1,
                    internstatus: 1,
                    resonablestatus: 1,
                    reasonname: 1,
                    rejoin: 1,
                    reasonablestatusremarks: 1,
                    department: 1,
                    dob: 1,
                    company: 1,
                    reasondate: 1,
                    empreason: 1,
                    percentage: 1,
                    doj: 1,
                    dot: 1,
                    role: 1,
                    assignExpLog: 1,
                    resonablestatus: 1,
                    reasonname: 1,
                    rejoin: 1,
                    reasonablestatusremarks: 1,
                    department: 1,
                    dob: 1,
                    gender: 1,
                    maritalstatus: 1,
                    bloodgroup: 1,
                    location: 1,
                    aadhar: 1,
                    panno: 1,
                    panstatus: 1,
                    panrefno: 1,
                    fathername: 1,
                    mothername: 1,
                    contactfamily: 1,
                    contactno: 1,
                    prefix: 1,
                    assignExpMode: 1,
                    assignExpvalue: 1,
                    processtype: 1,
                    processduration: 1,
                    date: 1,
                    time: 1,
                    grosssalary: 1,
                    timemins: 1,
                    modeexperience: 1,
                    targetexperience: 1,
                    targetpts: 1,
                    dom: 1,
                    contactpersonal: 1,
                    designationlog: 1,
                    processlog: 1,
                    boardingLog: 1,
                    attendancemode: 1,
                    company: 1,
                    reasondate: 1,
                    empreason: 1,
                    percentage: 1,
                    empcode: 1,
                    companyname: 1,
                    team: 1,
                    username: 1,
                    usernameautogenerate: 1,
                    workmode: 1,
                    email: 1,
                    employeecount: 1,
                    systemmode: 1,
                    companyemail: 1,
                    unit: 1,
                    branch: 1,
                    designation: 1,
                    floor: 1,
                    shift: 1,
                    reportingto: 1,
                    experience: 1,
                    doj: 1,
                    dot: 1,
                    bankdetails: 1,
                    shifttiming: 1,
                    shiftgrouping: 1,
                    shifttype: 1,
                    legalname: 1,
                    callingname: 1,
                    pdoorno: 1,
                    pstreet: 1,
                    parea: 1,
                    plandmark: 1,
                    ptaluk: 1,
                    ppost: 1,
                    ppincode: 1,
                    pcountry: 1,
                    pstate: 1,
                    pcity: 1,
                    cdoorno: 1,
                    cstreet: 1,
                    carea: 1,
                    role: 1,
                    clandmark: 1,
                    ctaluk: 1,
                    cpost: 1,
                    cpincode: 1,
                    ccountry: 1,
                    cstate: 1,
                    ccity: 1,
                    reasondate: 1,
                    process: 1,
                    workstation: 1,
                    workstationinput: 1,
                    workstationofficestatus: 1,
                    weekoff: 1,
                    originalpassword: 1,
                    enquirystatus: 1,
                    area: 1,
                    enableworkstation: 1,
                    wordcheck: 1,
                    shiftallot: 1,
                    firstname: 1,
                    lastname: 1,
                    employeecount: 1,
                    emergencyno: 1,
                    name: 1,
                    salarysetup: 1,
                    mode: 1,
                    salarycode: 1,
                    basic: 1,
                    hra: 1,
                    conveyance: 1,
                    medicalallowance: 1,
                    productionallowance: 1,
                    otherallowance: 1,
                    productionallowancetwo: 1,
                    pffromdate: 1,
                    pfenddate: 1,
                    esifromdate: 1,
                    esienddate: 1,
                    pfesistatus: 1,
                    remoteworkmodestatus: 1,
                    addremoteworkmode: 1,
                }).lean(),

                Attendance.find(
                    {
                        date: {
                            $in: pastThreeAttendaysDays,
                        },
                    },
                    { date: 1, userid: 1 }
                ).lean(),

                ApplyLeave.find(
                    {
                        date: { $in: pastThreeLeaveDays },
                    },
                    { employeename: 1, employeeid: 1, date: 1 }
                ).lean(),

                Holiday.find(
                    {
                        date: { $in: pastThreeDaysISO },
                    },
                    {
                        date: 1,
                        employee: 1,
                        company: 1,
                        applicablefor: 1,
                        unit: 1,
                        team: 1,
                    }
                ).lean(),

                Noticeperiod.aggregate(noticeperiodpipeline).exec(),
            ]);

        let employeeDocumentsMap = {};

        // Fetch profile images only if profileimage is true
        if (profileimage) {
            const employeeDocuments = await EmployeeDocuments.find(
                {
                    commonid: { $in: allusers.map((user) => user._id.toString()) },
                },
                { profileimage: 1, commonid: 1 }
            ).lean();

            // Create a map of employee documents by commonid (user's _id)
            employeeDocumentsMap = employeeDocuments.reduce((acc, doc) => {
                acc[doc.commonid] = doc.profileimage || "";
                return acc;
            }, {});
        }
        // Create a map for fast lookup of attendance records
        const attendanceMap = attendance.reduce((acc, item) => {
            const userId = item.userid.toString();
            const date = moment(item.date, "DD-MM-YYYY").format("DD/MM/YYYY");
            if (!acc[userId]) {
                acc[userId] = [];
            }
            acc[userId].push(date);
            return acc;
        }, {});

        // Create a map for fast lookup of leave records
        const leaveMap = allLeaveStatus.reduce((acc, item) => {
            const userKey = `${item.employeeid}_${item.employeename}`;
            const leaveDates = item.date.map((date) =>
                moment(date, "DD/MM/YYYY").format("DD/MM/YYYY")
            );
            if (!acc[userKey]) {
                acc[userKey] = [];
            }
            acc[userKey].push(...leaveDates);
            return acc;
        }, {});

        // Create a map for fast lookup of holiday records
        const employeeMatchesUser = (user, holiday) => {
            return (
                holiday.company.includes(user.company) &&
                holiday.applicablefor.includes(user.branch) &&
                holiday.unit.includes(user.unit) &&
                holiday.team.includes(user.team) &&
                (holiday.employee.includes(user.companyname) ||
                    holiday.employee.includes("ALL"))
            );
        };
        const holidayMap = holidays.reduce((acc, item) => {
            const date = moment(item.date).format("DD/MM/YYYY");

            allusers.forEach((user) => {
                if (employeeMatchesUser(user, item)) {
                    if (!acc[user.empcode]) {
                        acc[user.empcode] = [];
                    }
                    acc[user.empcode].push(date);
                }
            });

            return acc;
        }, {});

        // Create a map for fast lookup
        const noticePeriodMap = noticeperiodstatus.reduce((acc, item) => {
            const key = `${item.empname}_${item.empcode}`;
            acc[key] = item;
            return acc;
        }, {});

        // Function to check the status for the past 3 days
        const checkStatusForPast3Days = (
            userId,
            empcode,
            employeename,
            weekOffDays,
            doj
        ) => {
            const userKey = `${empcode}_${employeename}`;
            let absentDays = 0;
            let leaveDays = 0;
            let holidayDays = 0;
            const isNewJoiner = pastThreeDaysISO.includes(doj);
            for (let date of pastThreeLeaveDays) {
                // const dayOfWeek = moment(date, "DD/MM/YYYY").format("dddd"); // Get day of the week

                // if (weekOffDays.includes(dayOfWeek)) {
                //   continue; // Skip week off days
                // }
                if (attendanceMap[userId] && attendanceMap[userId].includes(date)) {
                    // User was present on this date
                    continue;
                } else if (leaveMap[userKey] && leaveMap[userKey].includes(date)) {
                    // User was on leave on this date
                    leaveDays++;
                } else if (holidayMap[empcode] && holidayMap[empcode].includes(date)) {
                    holidayDays++;
                } else {
                    // User was absent on this date
                    absentDays++;
                }
            }

            let status = null;
            if (isNewJoiner) {
                status = null;
            } else if (absentDays >= 4) {
                status = "Long Absent";
            } else if (leaveDays >= 4) {
                status = "Long Leave";
            }

            return { status, absentDays, leaveDays, holidayDays };
        };

        // Function to determine the status
        const determineStatus = (
            attendanceStatus,
            noticePeriodStatus,
            livestatus
        ) => {
            if (noticePeriodStatus === "Exit Confirmed") {
                return `Exit Confirmed`;
            } else if (!livestatus && noticePeriodStatus && attendanceStatus) {
                return `Notice Period ${noticePeriodStatus} and ${attendanceStatus}`;
            } else if (noticePeriodStatus) {
                return `Notice Period ${noticePeriodStatus}`;
            } else if (!noticePeriodStatus && attendanceStatus) {
                return attendanceStatus;
            } else if (!noticePeriodStatus && !attendanceStatus && livestatus) {
                return livestatus;
            } else {
                return "No Status";
            }
        };

        // Enrich users with status
        const enrichedLeaveAttendanceUsers = allusers.map((user) => {
            const userId = user._id.toString();
            let weekOffDays = [];
            if (user.boardingLog && user.boardingLog.length > 0) {
                const lastBoardingLog = user.boardingLog[user.boardingLog.length - 1];
                weekOffDays = lastBoardingLog.weekoff || [];
            }
            const userKey = `${user.companyname}_${user.empcode}`;
            const { status, absentDays, leaveDays } = checkStatusForPast3Days(
                userId,
                user.empcode,
                user.companyname,
                weekOffDays,
                user?.doj
            );
            const noticePeriodStatus =
                noticePeriodMap[userKey]?.exitstatus === true
                    ? "Exit Confirmed"
                    : noticePeriodMap[userKey]?.approvedStatus === "true" &&
                        noticePeriodMap[userKey]?.cancelstatus === false &&
                        noticePeriodMap[userKey]?.continuestatus === false
                        ? "Approved"
                        : noticePeriodMap[userKey]?.approvedStatus === "true" &&
                            noticePeriodMap[userKey]?.cancelstatus === true
                            ? "Cancelled"
                            : noticePeriodMap[userKey]?.approvedStatus === "true" &&
                                noticePeriodMap[userKey]?.continuestatus === true
                                ? "Continue"
                                : noticePeriodMap[userKey]?.rejectStatus === "true"
                                    ? "Rejected"
                                    : noticePeriodMap[userKey]?.recheckStatus === "true"
                                        ? "Recheck"
                                        : noticePeriodMap[userKey]?.status || null;
            const livestatus = !status && !noticePeriodStatus ? "Live" : null;
            const profileImage = profileimage
                ? employeeDocumentsMap[userId] || ""
                : null;
            return {
                ...user,
                attendanceStatus: noticePeriodStatus ? true : false,
                noticePeriodStatus: noticePeriodStatus ? true : false,
                livestatus: livestatus ? true : false,
                status: determineStatus(status, noticePeriodStatus, livestatus),
                longAbsentCount: absentDays, // Long absent count
                longLeaveCount: leaveDays, // Long leave count
                profileimage: profileimage ? profileImage : "",
            };
        });

        finalArray = enrichedLeaveAttendanceUsers;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!finalArray) {
        return next(new ErrorHandler("Users not found", 400));
    }

    return res.status(200).json({
        count: finalArray.length,
        allusers: finalArray,
    });
});


//total employee
exports.getUserWithStatusHomeCountTeam = catchAsyncErrors(async (req, res, next) => {
  let allusers;
  try {
    const { pageName, assignbranch, hierarchyempnames } = req.body;
    // console.log(hierarchyempnames, "hierarchyempnames");
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));
    let Query = { $or: branchFilter };
      if (branchFilter.length > 0) {
    // Define the past 3 days range
    const today = moment();
    const pastThreeAttendaysDays = [
      today.clone().subtract(1, "days").format("DD-MM-YYYY"),
      today.clone().subtract(2, "days").format("DD-MM-YYYY"),
      today.clone().subtract(3, "days").format("DD-MM-YYYY"),
    ];
    const pastThreeLeaveDays = [
      today.clone().subtract(1, "days").format("DD/MM/YYYY"),
      today.clone().subtract(2, "days").format("DD/MM/YYYY"),
      today.clone().subtract(3, "days").format("DD/MM/YYYY"),
    ];
    const pastThreeDaysISO = [
      today.clone().subtract(1, "days").format("YYYY-MM-DD"),
      today.clone().subtract(2, "days").format("YYYY-MM-DD"),
      today.clone().subtract(3, "days").format("YYYY-MM-DD"),
    ];
    // Fetch relevant attendance records for the past 3 days
    let attendance = await Attendance.find(
      {
        date: {
          $in: pastThreeAttendaysDays,
        },
      },
      { date: 1, userid: 1 }
    ).lean();
    // Fetch relevant leave records
    let allLeaveStatus = await ApplyLeave.find(
      {
        employeename: { $in: hierarchyempnames },
        date: { $in: pastThreeLeaveDays },
        status: { $nin: ["Rejected", "Cancel"] },
      },
      { employeename: 1, employeeid: 1, date: 1 }
    ).lean();

    let holidays = await Holiday.find(
      {
        employee: { $in: hierarchyempnames },
        date: { $in: pastThreeDaysISO },
      },
      { date: 1, employee: 1 }
    ).lean();

    let noticeperiodstatus = await Noticeperiod.find(
      { empname: { $in: hierarchyempnames } },
      {
        empname: 1,
        empcode: 1,
        status: 1,
        rejectStatus: 1,
        cancelstatus: 1,
        approvedStatus: 1,
        continuestatus: 1,
        recheckStatus: 1,
      }
    ).lean();

    // Create a map for fast lookup of attendance records
    const attendanceMap = attendance.reduce((acc, item) => {
      const userId = item.userid.toString();
      const date = moment(item.date, "DD-MM-YYYY").format("DD/MM/YYYY");
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(date);
      return acc;
    }, {});

    // Create a map for fast lookup of leave records
    const myCheckList = await MyCheckList.find({}).lean();
    let leaveWithCheckList = allLeaveStatus
      .map((item) => {
        let foundData = myCheckList?.find((dataNew) => dataNew.commonid == item._id);
        let areAllGroupsCompleted = foundData?.groups?.every(
          (itemNew) => (itemNew.data !== undefined && itemNew.data !== "") || itemNew.files !== undefined
        );

        if (areAllGroupsCompleted) {
          return {
            ...item,
            updatestatus: "Completed",
          };
        }
        return null;
      })
      .filter((item) => item);

    // Create a map for fast lookup of leave records
    const leaveMap = leaveWithCheckList.reduce((acc, item) => {
      const userKey = `${item.employeeid}_${item.employeename}`;
      const leaveDates = item.date.map((date) => moment(date, "DD/MM/YYYY").format("DD/MM/YYYY"));
      if (!acc[userKey]) {
        acc[userKey] = [];
      }
      acc[userKey].push(...leaveDates);
      return acc;
    }, {});

    // Create a map for fast lookup of holiday records
    const holidayMap = holidays.reduce((acc, item) => {
      const date = moment(item.date).format("DD/MM/YYYY");
      item.employee.forEach((employee) => {
        if (!acc[employee]) {
          acc[employee] = [];
        }
        acc[employee].push(date);
      });
      return acc;
    }, {});

    let filterQuery = {
      enquirystatus: {
        $nin: ["Enquiry Purpose"],
      },
      companyname: { $in: hierarchyempnames },
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      },
      ...Query,
    };

    filterQuery.workmode = {
      $ne: "Internship",
    };

  
      allusers = await User.countDocuments(filterQuery).lean();
    } else {
      allusers = [];
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    allusers,
  });
});

//todayleave
exports.getAllApplyleaveHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let applyleaves;
  try {
    let Query = {};
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;
    const { assignbranch, hierarchyempnames } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));
    if (branchFilter.length > 0) {
      Query = { $or: branchFilter };

    let filterQuery = {
      status: "Approved",
      employeename: { $in: hierarchyempnames },
      date: { $in: formattedDate },
      ...Query,
    };
    applyleaves = await Applyleave.countDocuments(filterQuery, { date: 1 });
        }else{
           applyleaves = []
        }
  } catch (err) {
    console.log(err, "errrerwefd");
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    applyleaves,
  });
});
//today leave list
exports.getAllApplyleaveHomeListTeam = catchAsyncErrors(async (req, res, next) => {
  let applyleaves;
  try {
    const currentDate = new Date();
     let Query = {};
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

    const { assignbranch,hierarchyempnames} = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));
   if (branchFilter.length > 0) {
     Query = { $or: branchFilter };

    let filterQuery = {
      status: 'Approved',
       employeename: { $in: hierarchyempnames },
      date: { $in: formattedDate },
      ...Query,
    };
    applyleaves = await Applyleave.find(filterQuery, {});
    }else{
           applyleaves = []
        }
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }
  if (!applyleaves) {
    return next(new ErrorHandler('Applyleave not found!', 404));
  }
  return res.status(200).json({
    applyleaves,
  });
});

//not checkin emp
exports.getAllUserHomeCountNotClockInTeam = catchAsyncErrors(async (req, res, next) => {
  let user;

  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;

    let users = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },
        companyname: { $in: req.body.hierarchyempnames },
        // resonablestatus: {
        //   $nin: ["Releave Employee", "Absconded", "Hold", "Terminate"],
        // },
      },
      {
        companyname: 1,
        username: 1,
        // _id: 1
      }
    );


    let filterquery = {
      date: formattedDate,
      username: users.map((d) => d.username),
    
    };
    console.log(
      formattedDate,
      users.map((d) => d.username),
      "userssss"
    );
    
    user = await Attendance.countDocuments(filterquery).lean();
  
    console.log(user, "user");
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  // if (!usersstatus) {
  //     return next(new ErrorHandler("Users not found", 400));
  // }

  return res.status(200).json({ user });
});

//notcheckin emp list
exports.getAllUserHomeCountNotClockInListTeam = catchAsyncErrors(async (req, res, next) => {
  let user, attendance, applyleaves, filtered;

  try {
     const { assignbranch,hierarchyempnames} = req.body;
      let Query = {};
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    const formattedDateApply = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    attendance = await Attendance.find({ date: formattedDate }, { username: 1, userid: 1 });

    applyleaves = await ApplyLeave.find({ status: 'Approved', employeename: { $in: hierarchyempnames }, date: { $in: formattedDateApply } }, { employeename: 1 }).lean();

    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));
  
     Query = { $or: branchFilter };

    let filterQuery = {
      enquirystatus: {
        $nin: ['Enquiry Purpose'],
      },
      resonablestatus: {
        $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'],
      },
       companyname: { $in: hierarchyempnames },
      ...Query,
    };

    filterQuery.workmode = {
      $ne: 'Internship',
    };

    let alluser = await User.find(filterQuery, { company: 1, branch: 1, unit: 1, team: 1, department: 1, username: 1, companyname: 1, empcode: 1, shifttiming: 1 });

    let finalfiltered = alluser.filter(
      (ur) =>
        !attendance.some((oldItem) => {
          return ur.username === oldItem.username && ur._id == oldItem.userid;
        })
    );
    // console.log(finalfiltered,hierarchyempnames,"finalfiltered")
    if (branchFilter.length > 0) {
      filtered = finalfiltered.filter(
        (ur) =>
          !applyleaves.some((oldItem) => {
            return ur.companyname === oldItem.employeename;
          })
      );
    } else {
      filtered = [];
    }
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }
  return res.status(200).json({ filtered });
});


//news and events
exports.getAllScheduleEventsHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let scheduleevent;
  try {
    const { assignbranch } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    let filterQuery = {
      $or: branchFilter,
      eventname: { $in: req.body.hierarchyempnames },
    };


    if (branchFilter.length > 0) {
      scheduleevent = await ScheduleEvents.find(filterQuery, { eventname: 1, eventdescription: 1 });
    } else {
      scheduleevent = [];
    }
  } catch (err) {
    console.log(err, "errevent");
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    scheduleevent,
  });
});


//today meeting list
exports.ScheduleMeetingFilterTeam = catchAsyncErrors(async (req, res, next) => {
  let schedulemeeting, filteredschedule, filteredschedulemeeting;

  try {
     const {hierarchyempnames} = req.body;
    schedulemeeting = await ScheduleMeeting.find({ $or:[ {participants: {$in: hierarchyempnames }},{participants: {$in: ["ALL"] } }]}, {
      company: 1, branch: 1, department: 1, team: 1, meetingcategory: 1,
      meetingtype: 1, meetingmode: 1, title: 1, date: 1, time: 1, duration: 1, timezone: 1, participants: 1,
      participantsid: 1, reminder: 1, interviewer: 1, meetinghostid: 1
    }).lean();
 

    filteredschedule = schedulemeeting;

    // Apply date filter based on selectedFilter
    const selectedFilter = req.body.selectedfilter; // Get the selected filter from the request body
    if (selectedFilter === "Today") {
      const today = moment().startOf("day");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(today, "day")
      );
    } else if (selectedFilter === "Weekly") {
      const startOfWeek = moment().startOf("week");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfWeek, "week")
      );
    } else if (selectedFilter === "Monthly") {
      const startOfMonth = moment().startOf("month");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfMonth, "month")
      );
    } else if (selectedFilter === "Yearly") {
      const startOfYear = moment().startOf("year");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfYear, "year")
      );
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    filteredschedule,
    filteredschedulemeeting,
  });
});



//advance
exports.getAllAdvanceByAssignBranchHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let advance;
  try {
      const {hierarchyempnames} = req.body;
    advance = await Advance.countDocuments({ status: 'Applied',employeename: {$in: hierarchyempnames } }, {}).lean();
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }
  //  if (!advance) {
  //return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    advance,
  });
});

exports.getAllAdvanceByAssignBranchHomeTeamList = catchAsyncErrors(async (req, res, next) => {
  let advance;
  try {
    const { assignbranch,hierarchyempnames} = req.body;
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    filterQuery = { $or: branchFilter };

    filterQuery.status = 'Applied';
   filterQuery.employeename= {$in: hierarchyempnames }

    advance = await Advance.find(filterQuery).lean();
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }
  if (!advance) {
    return next(new ErrorHandler('Data not found!', 404));
  }
  return res.status(200).json({
    // count: products.length,
    advance,
  });
});


//loan
exports.getAllLoanByAssignBranchHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let loan;
  try {
      const { hierarchyempnames} = req.body;
    loan = await Loan.countDocuments({ status: { $ne: 'Approved' }, employeename: { $in:hierarchyempnames } }, {});
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }
  return res.status(200).json({
    // count: products.length,
    loan,
  });
});


exports.getAllLoanByAssignBranchForPaginationList = catchAsyncErrors(async (req, res, next) => {
  const {hierarchyempnames, assignbranch, page, pageSize, allFilters, logicOperator, searchQuery } = req.body;

  try {
    // Validate input
    if (!assignbranch || !Array.isArray(assignbranch) || assignbranch.length === 0) {
      return next(new ErrorHandler('Invalid input format - assignbranch must be a non-empty array', 400));
    }

    // Validate pagination parameters
    const parsedPage = Math.max(1, parseInt(page)) || 1;
    const parsedPageSize = Math.max(1, parseInt(pageSize)) || 10;

    // Build the base query
    const query = {
      $or: assignbranch.map(({ company, branch, unit }) => ({
        company,
        branch,
        unit,
      })),
      status: { $ne: 'Approved' },
      employeename: { $in:hierarchyempnames }
    };

    // Process advanced filters with better validation
    if (Array.isArray(allFilters) && allFilters.length > 0) {
      const conditions = allFilters
        .filter((filter) => filter?.column && filter?.condition && (filter.value || ['Blank', 'Not Blank'].includes(filter.condition)))
        .map((filter) => createFilterCondition(filter.column, filter.condition, filter.value))
        .filter((condition) => Object.keys(condition).length > 0);

      if (conditions.length > 0) {
        const operator = ['and', 'or'].includes(logicOperator?.toLowerCase()) ? logicOperator.toLowerCase() : 'and';
        query[`$${operator}`] = conditions;
      }
    }

    // Search query handling with optimization
    // Search query handling with optimization
    if (typeof searchQuery === 'string' && searchQuery.trim()) {
      const searchTerms = searchQuery.trim().split(/\s+/);
      const searchConditions = searchTerms.map((term) => {
        const regex = new RegExp(escapeRegex(term), 'i');
        const orConditions = [
          { loanamount: regex },
          { startyear: regex },
          { month: regex },
          { applieddate: regex },
          { description: regex },
          { company: regex },
          { branch: regex },
          { unit: regex },
          { team: regex },
          { employeename: regex },
          { tenure: regex },
          { empcode: regex },
          { companyname: regex },
          { shifttiming: regex },
          { status: regex },
          { rejectedreason: regex },
          { approvedloanstartdate: regex },
          { approvedinstallment: regex },
          { interestpercent: regex },
          { approvedloanamount: regex },
          { approvedstartmonth: regex },
          { approvedstartyear: regex },
          { totalamountpayable: regex },
        ];

        // Special handling for date fields
        const dateFormats = [
          'DD-MM-YYYY', // 16-04-2024
          'YYYY-MM-DD', // 2024-04-16
          'MM-DD-YYYY', // 04-16-2024
          'DD/MM/YYYY', // 16/04/2024
          'YYYY/MM/DD', // 2024/04/16
        ];

        // Try to parse the term as a date
        let dateObj;
        for (const format of dateFormats) {
          dateObj = moment(term, format, true);
          if (dateObj.isValid()) break;
        }

        if (dateObj && dateObj.isValid()) {
          // If term is a valid date, search in ISO format
          orConditions.push({
            applieddate: dateObj.format('YYYY-MM-DD'),
          });
        } else {
          // Fallback to regex search for non-date or invalid date terms
          orConditions.push({ applieddate: regex });
        }

        // Only add numeric condition if term is a valid number
        if (!isNaN(term) && term.trim() !== '') {
          orConditions.push({ count: Number(term) });
        }

        return { $or: orConditions };
      });

      query.$and = (query.$and || []).concat(searchConditions);
    }

    // Helper function to escape regex special characters
    function escapeRegex(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    // Execute queries in parallel
    const [totalProjects, result] = await Promise.all([
      Loan.countDocuments(query),
      Loan.find(query)
        .lean()
        .skip((parsedPage - 1) * parsedPageSize)
        .limit(parsedPageSize),
    ]);

    // Process data with proper error handling for dates
    const formattedAdvances = result.map((t) => {
      // Helper function to safely parse dates
      const safeDateParse = (dateValue) => {
        if (!dateValue) return moment.invalid();
        if (dateValue instanceof Date) return moment(dateValue);

        // Try common formats
        const formats = [moment.ISO_8601, 'YYYY-MM-DD HH:mm:ss', 'DD-MM-YYYY HH:mm:ss', 'YYYY/MM/DD HH:mm:ss', 'DD/MM/YYYY HH:mm:ss', 'YYYY-MM-DD', 'DD-MM-YYYY'];

        for (const format of formats) {
          const parsed = moment(dateValue, format, true);
          if (parsed.isValid()) return parsed;
        }

        return moment(dateValue); // Fallback to loose parsing
      };

      const applieddate = safeDateParse(t.applieddate);
      const createdDate = t.addedby?.[0]?.date ? safeDateParse(t.addedby[0].date) : moment.invalid();

      return {
        ...t,
        applieddates: applieddate.isValid() ? applieddate.format('DD-MM-YYYY') : 'Invalid Date',
        createddatetime: createdDate.isValid() ? createdDate.format('DD-MM-YYYY hh:mm:ss a') : t.addedby?.[0]?.date || 'No Date',
      };
    });

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300');

    return res.status(200).json({
      success: true,
      count: formattedAdvances.length,
      totalProjects,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalProjects / parsedPageSize),
      loan: formattedAdvances,
    });
  } catch (err) {
    console.error('Error fetching advances:', err);

    //   if (err.name === 'CastError') {
    //     return next(new ErrorHandler("Invalid data format in database", 400));
    //   }
    //   if (err.name === 'MongoError') {
    //     return next(new ErrorHandler("Database error occurred", 500));
    //   }
    //   return next(new ErrorHandler("Server error while processing request", 500));
  }
});



exports.getAllApplyleaveFilterHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let applyleaves, leaveverification;
  hierarchyempnames
  try {
    // if (!req.body.role.includes('Manager')) {
      leaveverification = await LeaveVerification.find({ employeenameto: { $in: req.body.username } }, { employeenamefrom: 1, _id: 0 });
      // console.log(leaveverification.map(d => d.employeenamefrom).flat(), "leaveveri")

      const filtered = leaveverification.map((d) => d.employeenamefrom).flat().filter((d) =>
  req.body.hierarchyempnames.includes(d)
);
      applyleaves = await Applyleave.countDocuments(
        {
          status: 'Applied',
          employeename: { $in:filtered},
        },
        {
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          department: 1,
          date: 1,
          status: 1,
          employeename: 1,
          employeeid: 1,
          leavetype: 1,
          reasonforleave: 1,
          rejectedreason: 1,
          numberofdays: 1,
        }
      );
 
  } catch (err) {
    console.log(err, 'errleave');
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({
    applyleaves,
  });
});



exports.getAllPermissionsHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let permissions, leaveverification;
  try {
    
      leaveverification = await LeaveVerification.find({ employeenameto: { $in: req.body.username } }, { employeenamefrom: 1, _id: 0 });

       const filtered = leaveverification.map((d) => d.employeenamefrom).flat().filter((d) =>
  req.body.hierarchyempnames.includes(d))

      permissions = await Permission.countDocuments(
        {
          status: 'Applied',
          employeename: { $in:filtered},
        },
        {}
      );
     
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({
    permissions,
  });
});



exports.dayPointsfilterHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, compare } = req.body;

    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    const query = {};

    if (fromdate && todate) {
      query.date = { $gte: fromdate, $lte: todate };
      // conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
    }

    // let users = await User.find({
    //   resonablestatus: {
    //     $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
    //   }
    // }, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1, assignExpLog: 1, processlog: 1, doj: 1 });

    // let salSlabs = await SalarySlabs.find({}, { company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1, medicalallowance: 1, conveyance: 1, productionallowance: 1, otherallowance: 1 });
    // let manageshortagemasters = await ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 });
    // let revenueAmount = await RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 });
    // let acPointCal = await AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 });
    // let departments = await Department.find({}, { deptname: 1, prod: 1 });

    // daypointsupload = await DayPointsUpload.find(query, { uploaddata: 1 }).limit(6);
    console.log(query, 'queryday');
    const [
      users,
      // salSlabs,
      manageshortagemasters,
      // revenueAmount,
      acPointCal,
      departments,
      daypointsupload,
    ] = await Promise.all([
      User.find(
        {
          resonablestatus: {
            $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'],
          },
        },
        {
          department: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
          assignExpLog: 1,
          processlog: 1,
          doj: 1,
        }
      ).lean(),
      // SalarySlabs.find(
      //   {},
      //   {
      //     company: 1,
      //     branch: 1,
      //     salarycode: 1,
      //     basic: 1,
      //     hra: 1,
      //     salaryslablimited: 1,
      //     medicalallowance: 1,
      //     conveyance: 1,
      //     productionallowance: 1,
      //     otherallowance: 1,
      //   }
      // ),
      ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 }).lean(),
      // RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 }),
      AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 }).lean(),
      Department.find({}, { deptname: 1, prod: 1 }).lean(),
      DayPointsUpload.find(query, { uploaddata: 1 }).lean(),
    ]);

    console.log(daypointsupload.length, query, 'daypointsupload');
    if (daypointsupload.length > 0) {
      let answer = daypointsupload.flatMap((data) =>
        data.uploaddata
          .map((upload) => ({
            companyname: upload.companyname,
            name: upload.name,
            empcode: upload.empcode,
            branch: upload.branch,
            unit: upload.unit,
            team: upload.team,
            date: upload.date,
            processcode: upload.processcode,
            exper: upload.exper,

            target: upload.target,
            point: upload.point,
            avgpoint: upload.avgpoint,
            id: upload._id,
            mainid: data._id,
          }))
      ).filter((item, index) => req.body.hierarchyempnames.includes(item.name));



console.log(answer,req.body.hierarchyempnames,"answer")

      const filteredArray = answer
        // .filter((item, index) => index <= 5)
        .map((obj1) => {
          const splitDate = obj1.date.split('-');
          const oldyear = splitDate[0];
          const oldmonth = splitDate[1];

          const matchingMinpointuser = users.find((obj2) => {
            return (
              obj1.name === obj2.companyname &&
              obj1.branch === obj2.branch &&
              obj1.unit === obj2.unit &&
              obj1.team === obj2.team
            );
          });

          if (matchingMinpointuser) {
            obj1.department = matchingMinpointuser.department;
            obj1.assignExpLog = matchingMinpointuser.assignExpLog;
            obj1.processlog = matchingMinpointuser.processlog;
            obj1.doj = matchingMinpointuser.doj;
          }

          const matchingMinpointdept = departments.find((obj2) => {
            return obj1.department === obj2.deptname;
          });

          if (matchingMinpointdept) {
            obj1.prod = matchingMinpointdept.prod;
          }

          return obj1;
        });
      console.log(filteredArray.length, 'filteredArray');
      // let filtereary = filteredArray.map(item => item[0])
      let belowMin = filteredArray.reduce((acc, current) => {
        const existingItemIndex = acc.findIndex(
          (item) =>
            item.name === current.name &&
            // && item.companyname === current.companyname
            item.branch === current.branch &&
            item.unit === current.unit &&
            item.team === current.team &&
            item.empcode === current.empcode
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.point += Number(current.point);
          existingItem.daypoint += Number(current.daypoint);
          existingItem.target += Number(current.target);
          existingItem.date.push(current.date);

          existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

          // Convert the dates array to Date objects
          const dateObjects = existingItem.date.map((date) => new Date(date));

          // Find the earliest (from) and latest (to) dates
          const fromDate = new Date(Math.min(...dateObjects));
          const toDate = new Date(Math.max(...dateObjects));

          // Format the dates as strings in "YYYY-MM-DD" format
          const formattedFromDate = fromDate.toISOString().split('T')[0];
          const formattedToDate = toDate.toISOString().split('T')[0];

          // Update start and end date
          existingItem.startDate = fromDate;
          existingItem.endDate = toDate;
        } else {
          // Add new item
          acc.push({
            companyname: current.companyname,
            name: current.name,
            daypoint: Number(current.daypoint),
            avgpoint: (Number(current.point) / Number(current.target)) * 100,
            point: Number(current.point),
            target: Number(current.target),
            _id: current.id,
            branch: current.branch,
            date: [current.date],
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,
            processcode: current.processcode,
            exper: current.exper,
            doj: current.doj,
            department: current.department,
            prod: current.prod,
            startDate: current.date,
            endDate: current.date,
          });
        }
        return acc;
      }, []);

      const processcodes = belowMin.filter((item,index) => index <= 5)?.map((item, index) => {
        let findexpval = Number(item.exper) < 1 ? '00' : Number(item.exper) <= 9 ? `0${Number(item.exper)}` : item.exper;
        return `${item.processcode}${findexpval}`;
      });

      const [salSlabs, revenueAmount] = await Promise.all([
        SalarySlabs.find(
          { salarycode: { $in: processcodes } },
          {
            company: 1,
            branch: 1,
            salarycode: 1,
            basic: 1,
            hra: 1,
            salaryslablimited: 1,
            medicalallowance: 1,
            conveyance: 1,
            productionallowance: 1,
            otherallowance: 1,
          }
        ),
        RevenueAmount.find({ processcode: { $in: processcodes } }, { branch: 1, company: 1, processcode: 1, amount: 1 }).lean(),
      ]);
      // console.log(salSlabs.length, revenueAmount.length, "elg")
      const itemsWithSerialNumber = belowMin?.map((item, index) => {
        const findUserDepartment = users.find((d) => d.companyname === item.name)?.department;
        const prodTrue = departments.find((data) => data.deptname === findUserDepartment)?.prod;

        let findexpval = Number(item.exper) < 1 ? '00' : Number(item.exper) <= 9 ? `0${Number(item.exper)}` : item.exper;
        let processcodeexpvalue = `${item.processcode}${findexpval}`;
        //findsalary from salaryslab
        let findSalDetails = salSlabs.find((d) => d.company === item.companyname && d.branch === item.branch && d.salarycode === processcodeexpvalue);
        //shortageamount from shortage master
        let findShortage = manageshortagemasters.find((d) => d.department === findUserDepartment && Number(item.exper) >= Number(d.from) && Number(item.exper) <= Number(d.to));
        //revenue amount from revenue  master
        let findRevenueAllow = revenueAmount.find((d) => d.company === item.companyname && d.branch === item.branch && d.processcode === processcodeexpvalue);

        let findAcPointVal = acPointCal.find((d) => d.company === item.companyname && d.branch === item.branch && d.department === findUserDepartment);

        // GROSS VALUE
        let grossValue = findSalDetails ? Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance) : 0;

        let egvalue = Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

        let hfvalue = egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
        // let i60value = Number(hfvalue) / 60;
        // let j85value = (i60value * 8.5) / 27;
        let i60value = Number(hfvalue) / (findAcPointVal && Number(findAcPointVal.multiplevalue));
        let j85value = (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue))) / 27;
        // console.log(j85value, "j85value")
        return {
          // assignExpLog: item.assignExpLog,
          branch: item.branch,
          department: findUserDepartment,
          empcode: item.empcode,
          name: item.name,
          point: item.point,
          companyname: item.companyname,
          avgpoint: item.avgpoint,
          // processlog: item.processlog,
          prod: prodTrue,
          // doj: item.doj,
          date: item.date,
          exper: item.exper,
          target: item.target,

          team: item.team,
          unit: item.unit,
          id: item.id,
          startDate: item.startDate,
          endDate: item.endDate,
          // daystatus: item.daystatus,
          // weekoff: item.weekoff,
          daypoint: Number(j85value),
        };
      });

      console.log(itemsWithSerialNumber[0], 'itemsWithSerialNumber');
      productionupload = itemsWithSerialNumber;
      //.filter((item) => item.prod === true);
    } else {
      productionupload = [];
    }

    return res.status(200).json(productionupload);
  } catch (err) {
    console.log(err, 'erersk');
    return next(new ErrorHandler('Records not found!', 404));
  }
});


// get All ClientUserID Name => /api/clientuserids
// get All ClientUserID Name => /api/clientuserids
exports.tempPointsfilterHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, compare, } = req.body;
    // console.log(fromdate, todate, "llllll")

    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    const query = {};

    if (fromdate && todate) {
      query.date = { $gte: fromdate, $lte: todate }
    }




    const [
      users,
      // salSlabs,
      manageshortagemasters,
      // revenueAmount,
      acPointCal,
      departments,
      daypointsupload
    ] = await Promise.all([
      User.find(
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
        {
          department: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
          assignExpLog: 1,
          processlog: 1,
          doj: 1,
        }
      ),
      // SalarySlabs.find(
      //   {},
      //   {
      //     company: 1,
      //     branch: 1,
      //     salarycode: 1,
      //     basic: 1,
      //     hra: 1,
      //     salaryslablimited: 1,
      //     medicalallowance: 1,
      //     conveyance: 1,
      //     productionallowance: 1,
      //     otherallowance: 1,
      //   }
      // ),
      ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 }).lean(),
      // RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 }),
      AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 }).lean(),
      Department.find({}, { deptname: 1, prod: 1 }).lean(),
      TempPointsUpload.find(query, { uploaddata: 1 }).limit(5).lean(),
    ]);



    // console.log(daypointsupload.length, query, "daypointsupload")
    if (daypointsupload.length > 0) {

      let answer = daypointsupload.flatMap((data) =>
         data.uploaddata
      // .filter((item, index) => index <= 6)
          .map((upload) => ({
            companyname: upload.companyname,
            name: upload.name,
            empcode: upload.empcode,
            branch: upload.branch,
            unit: upload.unit,
            team: upload.team,
            date: upload.date,
            processcode: upload.processcode,
            exper: upload.exper,

            target: upload.target,
            point: upload.point,
            avgpoint: upload.avgpoint,
            id: upload._id,
            mainid: data._id,
          }))
      ).filter((item, index) => req.body.hierarchyempnames.includes(item.name));
      const filteredArray = answer
      // .filter((item, index) => index <= 5)
      .map((obj1) => {
        const splitDate = obj1.date.split("-");


        const matchingMinpointuser = users.find((obj2) => {
          return (
            obj1.name === obj2.companyname &&
            obj1.branch === obj2.branch &&
            // obj1.companyname === obj2.company
            //  && obj1.empcode === obj2.empcode
            // &&
            obj1.unit === obj2.unit &&
            obj1.team === obj2.team
          );
        });

        if (matchingMinpointuser) {
          obj1.department = matchingMinpointuser.department;
          obj1.assignExpLog = matchingMinpointuser.assignExpLog;
          obj1.processlog = matchingMinpointuser.processlog;
          obj1.doj = matchingMinpointuser.doj;
        }

        const matchingMinpointdept = departments.find((obj2) => {
          return obj1.department === obj2.deptname;
        });

        if (matchingMinpointdept) {
          obj1.prod = matchingMinpointdept.prod;
        }

        return obj1;
      });
      // let filtereary = filteredArray.map(item => item[0])
      let belowMin = filteredArray.reduce((acc, current) => {
        const existingItemIndex = acc.findIndex(
          (item) =>
            item.name === current.name &&
            // && item.companyname === current.companyname
            item.branch === current.branch &&
            item.unit === current.unit &&
            item.team === current.team &&
            item.empcode === current.empcode
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.point += Number(current.point);
          existingItem.daypoint += Number(current.daypoint);
          existingItem.target += Number(current.target);
          existingItem.date.push(current.date);

          existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

          // Convert the dates array to Date objects
          const dateObjects = existingItem.date.map((date) => new Date(date));

          // Find the earliest (from) and latest (to) dates
          const fromDate = new Date(Math.min(...dateObjects));
          const toDate = new Date(Math.max(...dateObjects));

          // Format the dates as strings in "YYYY-MM-DD" format

          // Update start and end date
          existingItem.startDate = fromDate;
          existingItem.endDate = toDate;
        } else {
          // Add new item
          acc.push({
            companyname: current.companyname,
            name: current.name,
            daypoint: Number(current.daypoint),
            avgpoint: (Number(current.point) / Number(current.target)) * 100,
            point: Number(current.point),
            target: Number(current.target),
            _id: current.id,
            branch: current.branch,
            date: [current.date],
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,
            processcode: current.processcode,
            exper: current.exper,
            doj: current.doj,
            department: current.department,
            prod: current.prod,
            startDate: current.date,
            endDate: current.date,
          });
        }
        return acc;
      }, []);

      const processcodes = belowMin.filter((item,index) => index <= 5)?.map((item, index) => {
        let findexpval = Number(item.exper) < 1 ? "00" : Number(item.exper) <= 9 ? `0${Number(item.exper)}` : item.exper;
        return `${item.processcode}${findexpval}`;
      })

      const [

        salSlabs,
        revenueAmount
      ] = await Promise.all([

        SalarySlabs.find(
          { salarycode: { $in: processcodes } },
          {
            company: 1,
            branch: 1,
            salarycode: 1,
            basic: 1,
            hra: 1,
            salaryslablimited: 1,
            medicalallowance: 1,
            conveyance: 1,
            productionallowance: 1,
            otherallowance: 1,
          }
        ).lean(),
        RevenueAmount.find({ processcode: { $in: processcodes } }, { branch: 1, company: 1, processcode: 1, amount: 1 }).lean(),
      ]);
      // console.log(salSlabs.length, revenueAmount.length, "elg")
      const itemsWithSerialNumber = belowMin?.map((item, index) => {
        const findUserDepartment = users.find((d) => d.companyname === item.name)?.department;
        const prodTrue = departments.find((data) => data.deptname === findUserDepartment)?.prod;

        let findexpval = Number(item.exper) < 1 ? "00" : Number(item.exper) <= 9 ? `0${Number(item.exper)}` : item.exper;
        let processcodeexpvalue = `${item.processcode}${findexpval}`;
        //findsalary from salaryslab
        let findSalDetails = salSlabs.find((d) => d.company === item.companyname && d.branch === item.branch && d.salarycode === processcodeexpvalue);
        //shortageamount from shortage master
        let findShortage = manageshortagemasters.find((d) => d.department === findUserDepartment && Number(item.exper) >= Number(d.from) && Number(item.exper) <= Number(d.to));
        //revenue amount from revenue  master
        let findRevenueAllow = revenueAmount.find((d) => d.company === item.companyname && d.branch === item.branch && d.processcode === processcodeexpvalue);

        let findAcPointVal = acPointCal.find((d) => d.company === item.companyname && d.branch === item.branch && d.department === findUserDepartment);

        // GROSS VALUE
        let grossValue = findSalDetails ? Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance) : 0;

        let egvalue = Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

        let hfvalue = egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
        // let i60value = Number(hfvalue) / 60;
        // let j85value = (i60value * 8.5) / 27;
        let i60value = Number(hfvalue) / (findAcPointVal && Number(findAcPointVal.multiplevalue));
        let j85value = (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue))) / 27;
        // console.log(j85value, "j85value")
        return {
          // assignExpLog: item.assignExpLog,
          branch: item.branch,
          department: findUserDepartment,
          empcode: item.empcode,
          name: item.name,
          point: item.point,
          companyname: item.companyname,
          avgpoint: item.avgpoint,
          // processlog: item.processlog,
          prod: prodTrue,
          // doj: item.doj,
          date: item.date,
          exper: item.exper,
          target: item.target,

          team: item.team,
          unit: item.unit,
          id: item.id,
          startDate: item.startDate,
          endDate: item.endDate,	
          // daystatus: item.daystatus,
          // weekoff: item.weekoff,
          daypoint: Number(j85value),
        };
      });


      //console.log(itemsWithSerialNumber[0], "itemsWithSerialNumber")
      productionupload = itemsWithSerialNumber;
    } else {
      productionupload = []
    }

    return res.status(200).json(productionupload);
  } catch (err) {
    console.log(err, "erersk")
    return next(new ErrorHandler("Records not found!", 404));
  }


});



exports.getAllUsersexceldataAssignbranchHomeTeam = catchAsyncErrors(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    // Months are zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    function getStartOfMonth() {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return startOfMonth.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    }

    let monthstartdate = getStartOfMonth();

    const query = {
      workmode: { $ne: 'Internship' },
      enquirystatus: { $nin: ['Enquiry Purpose'] },
companyname:{$in:req.body.hierarchyempnames},
      
      resonablestatus: {
        $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'],
        // reasondate:{$gt:monthstartdate}
      },
      // companyname: "VINITHA.NATESAN",
    };

    const month = currentMonth;
    const year = currentYear;

    let users, usersAll, depMonthSet;

    depMonthSet = await DepartmentMonth.find({ monthname: month, year: year }, { department: 1, fromdate: 1, todate: 1 }).lean();

    usersAll = await User.find(query).limit(6);
    const fromDateSet = [...new Set(depMonthSet.map((d) => d.fromdate))];
    users = usersAll
      .map((item) => {
        let findUserDeprtment = item.department;

        if (item.departmentlog && item.departmentlog.length > 1) {
          // const findDept = item.departmentlog.find(dept => fromDateSet.includes(dept.startdate) );
          const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));

          const findDept = sortedDepartmentLog.find((dept) => fromDateSet.includes(dept.startdate) || fromDateSet.some((fromDate) => new Date(fromDate) > new Date(dept.startdate)));
          findUserDeprtment = findDept ? findDept.department : '';
        } else if (item.departmentlog && item.departmentlog.length > 0) {
          findUserDeprtment = new Date(item.doj) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : '';
        }
        let findfromtodate = depMonthSet.find((d) => d.department === findUserDeprtment);
        let fromdate = findfromtodate ? findfromtodate.fromdate : '';
        let todate = findfromtodate ? findfromtodate.todate : '';
        if (item.reasondate == '' || (item.resonablestatus !== '' && new Date(item.reasondate) >= new Date(fromdate))) {
          return {
            ...item._doc, // Use _doc to avoid including Mongoose metadata
            department: findUserDeprtment,
          };
        }

        // return null; // Exclude users who don't match the department
      })
      .filter((item) => item !== null && item !== undefined);
console.log(users.length,"usersexceldata")
    return res.status(200).json({ users });
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }
  // if (!users || users.length === 0) {
  //     return next(new ErrorHandler("Users not found", 400));
  // }
});







exports.getAllUsersexceldataAssignbranchTeamDashboard = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch, month, year } = req.body;

  const query = {
    workmode: { $ne: 'Internship' },
   companyname:{$in:req.body.hierarchyempnames},
      enquirystatus: { $nin: ['Enquiry Purpose'] },
    // companyname: "VINITHA.NATESAN",
  };

  if (assignbranch.length > 0) {
  

    query.$or = assignbranch.map((item) => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit,
    }));
  }

  let users, usersAll, depMonthSet;
  try {
    // console.log(query,req.body.hierarchyempnames,"querysdfsdsdf")
    depMonthSet = await DepartmentMonth.find({ monthname: month, year: year }, { department: 1, fromdate: 1, todate: 1 });
    usersAll = await User.find(query, {company:1,branch:1,unit:1,department:1,reasondate:1,boardingLog:1,team:1,departmentlog:1,assignExpLog:1,processlog:1,empcode:1,companyname:1,doj:1});
    const fromDateSet = [...new Set(depMonthSet.map((d) => d.fromdate))];
    // console.log(usersAll,"")
    users = usersAll
      .map((item) => {
        let findUserDeprtment = item.department;

        if (item.departmentlog && item.departmentlog.length > 1) {
          // const findDept = item.departmentlog.find(dept => fromDateSet.includes(dept.startdate) );
          const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));

          const findDept = sortedDepartmentLog.find((dept) => fromDateSet.includes(dept.startdate) || fromDateSet.some((fromDate) => new Date(fromDate) > new Date(dept.startdate)));
          findUserDeprtment = findDept ? findDept.department : '';
        } else if (item.departmentlog && item.departmentlog.length > 0) {
          findUserDeprtment = new Date(item.doj) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : '';
        }
        let findfromtodate = depMonthSet.find((d) => d.department === findUserDeprtment);
        let fromdate = findfromtodate ? findfromtodate.fromdate : '';
        let todate = findfromtodate ? findfromtodate.todate : '';
        if (item.reasondate == '' || (item.resonablestatus !== '' && new Date(item.reasondate) >= new Date(fromdate))) {
          return {

            ...item._doc, // Use _doc to avoid including Mongoose metadata
            company:item.company,
            // company:item.company,
            // company:item.company,
            // company:item.company,
            // company:item.company,
            // company:item.company,
            // company:item.company,
            department: findUserDeprtment,
          };
        }

        // return null; // Exclude users who don't match the department
      })
      .filter((item) => item !== null && item != undefined);
     console.log(users.length,"usersminlist")
  } catch (err) {

    return next(new ErrorHandler('Records not found!', 404));
  }
  // if (!users || users.length === 0) {
  //     return next(new ErrorHandler("Users not found", 400));
  // }
  return res.status(200).json({ count: users.length, users });
});

//miniumum points 
exports.getAllUserTotalShiftDaysHomeDashboardTeam = catchAsyncErrors(async (req, res, next) => {
  let resultshiftallot = [];
  let graceTime;
  let clockOutHours;
  let lateclockincount;
  let earlyclockoutcount;
  let onclockout;
  let earlyclockin;
  let earlyclockout;
  let lateclockin;
  let afterlateclockin;
  let beforeearlyclockout;
  let finaluser = [];

   try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const currentYear = currentDate.getFullYear();
  
      const ismonth = currentMonth;
      const isyear = currentYear;
  
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      let querydeptmonth = {
        monthname: monthNames[ismonth - 1],
        year: isyear,
      };
      let [usersAll, depMonthSet, controlcriteria, holidays, leavetype] = await Promise.all([
        User.find({ companyname: { $in: req.body.name } }).limit(6),
  
        DepartmentMonth.find(querydeptmonth, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 }),
        ControlCriteria.find(),
        Holiday.find({}, { date: 1, company: 1, applicablefor: 1, unit: 1, team: 1, employee: 1, noofdays: 1 }),
        Leavetype.find({}, { leavetype: 1, code: 1 }),
      ]);
  console.log(req.body.name,usersAll.length,"usersminimum")
      const resultDateArray = depMonthSet.reduce(
        (acc, curr) => {
          if (new Date(curr.fromdate) < new Date(acc.fromdate)) {
            acc.fromdate = curr.fromdate;
          }
          // Compare and update the latest todate
          if (new Date(curr.todate) > new Date(acc.todate)) {
            acc.todate = curr.todate;
          }
          return acc;
        },
        {
          fromdate: depMonthSet[0].fromdate,
          todate: depMonthSet[0].todate,
        }
      );
  
      function formatDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
      }
  
      let attFromDate = resultDateArray.fromdate;
      let attToDate = resultDateArray.todate;
  
      const fromDateSet = [...new Set(depMonthSet.map((d) => d.fromdate))];
  
      let users = usersAll
        .map((item) => {
          let findUserDeprtment = item.department;
  
          if (item.departmentlog && item.departmentlog.length > 1) {
            // const findDept = item.departmentlog.find(dept => fromDateSet.includes(dept.startdate) );
            const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
  
            const findDept = sortedDepartmentLog.find((dept) => fromDateSet.includes(dept.startdate) || fromDateSet.some((fromDate) => new Date(fromDate) > new Date(dept.startdate)));
            findUserDeprtment = findDept ? findDept.department : '';
          } else if (item.departmentlog && item.departmentlog.length > 0) {
            findUserDeprtment = new Date(item.doj) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : '';
          }
  
          // if (department.includes(findUserDeprtment)) {
          return {
            ...item._doc, // Use _doc to avoid including Mongoose metadata
            department: findUserDeprtment,
          };
  
          // }
  
          // return null; // Exclude users who don't match the department
        })
        .filter((item) => item !== null && item !== undefined);
  console.log(users.length,"123")
      const userIds = users.map((user)  => user._id);
      const userCds = users.map((user) => user.companyname);
      const [attendance, allLeaveStatus, permission, leavecriterias] = await Promise.all([
        Attendance.find({ userid: { $in: userIds }, createdAt: { $gte: attFromDate, $lte: attToDate } }),
        ApplyLeave.find({ employeename: { $in: userCds } }),
        Permission.find({ employeename: { $in: userCds } }, { employeeid: 1, date: 1, status: 1, applytype: 1, compensationstatus: 1, compensationapplytype: 1, requesthours: 1 }),
        Leavecriteria.find({ leavetype: 'No Call/No Show' }, { mode: 1, company: 1, branch: 1, unit: 1, team: 1, employee: 1, designation: 1, department: 1, leavetype: 1, tookleave: 1 }),
      ]);

      // console.log(leavecriterias,"leavecriterias")
      // graceTime = controlcriteria[0].gracetime;
      clockOutHours = controlcriteria[0].clockout;
      lateclockincount = controlcriteria[0].lateclockincount;
      earlyclockoutcount = controlcriteria[0].earlyclockoutcount;
      onclockout = controlcriteria[0].onclockout;
      earlyclockin = controlcriteria[0].earlyclockin;
      lateclockin = controlcriteria[0].lateclockin;
      earlyclockout = controlcriteria[0].earlyclockout;
      afterlateclockin = controlcriteria[0].afterlateclockin;
      beforeearlyclockout = controlcriteria[0].afterlateclockin;

      finaluser = users?.flatMap((item, index) => {
        let isEmployeeGrace = controlcriteria[0].todos && controlcriteria[0].todos.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.team === item.team && d.employeename === item.companyname);
  
        if (isEmployeeGrace) {
          graceTime = isEmployeeGrace.employeegracetime;
        } else {
          graceTime = controlcriteria[0].gracetime;
        }
  
        let userDates = [];
  
        // Remove duplicate entries with the most recent entry
        const uniqueEntriesDep = {};
        item.departmentlog?.forEach((entry) => {
          const entryDate = new Date(entry.startdate); // Parse the startdate into a date object
          const key = entry.startdate;
  
          if (!(key in uniqueEntriesDep)) {
            uniqueEntriesDep[key] = entry;
          }
        });
  
        const comparedDate = depMonthSet?.filter((d) => d.department === item.department);
  
        if (comparedDate && comparedDate.length > 0) {
          comparedDate?.forEach((dep) => {
            if (!dep.fromdate && !dep.todate) {
              return '';
            }
  
            if (!item.doj) {
              return '';
            }
  
            const [year2, month2, day2] = item.doj?.split('-').map(Number);
            const joiningDate = new Date(year2, month2 - 1, day2);
            const [year1, month1, day1] = dep.fromdate?.split('-').map(Number);
            const [year, month, day] = dep.todate?.split('-').map(Number);
            const lastDate = new Date(year, month - 1, day);
            const firstDate = new Date(year1, month1 - 1, day1);
  
            if (joiningDate < firstDate) {
              // Check if the shift date is before or equal to the current date
              if (lastDate >= currentDateAttStatus) {
                // If matched, push the range from 'fromdate' to 'todate'
                const startDate = new Date(firstDate);
                // Loop through the dates in the range
                while (startDate <= currentDateAttStatus) {
                  userDates.push({
                    formattedDate: format(startDate, 'dd/MM/yyyy'),
                    dayName: format(startDate, 'EEEE'),
                    dayCount: startDate.getDate(),
                  });
                  startDate.setDate(startDate.getDate() + 1);
                }
              } else if (lastDate <= currentDateAttStatus) {
                // If matched, push the range from 'fromdate' to 'todate'
                const startDate = new Date(firstDate);
                // Loop through the dates in the range
                while (startDate <= lastDate) {
                  userDates.push({
                    formattedDate: format(startDate, 'dd/MM/yyyy'),
                    dayName: format(startDate, 'EEEE'),
                    dayCount: startDate.getDate(),
                  });
                  startDate.setDate(startDate.getDate() + 1);
                }
              }
            } else {
              // Check if the shift date is before or equal to the current date
              if (lastDate >= currentDateAttStatus) {
                // If matched, push the range from 'fromdate' to 'todate'
                const startDate = new Date(joiningDate);
                // Loop through the dates in the range
                while (startDate <= currentDateAttStatus) {
                  userDates.push({
                    formattedDate: format(startDate, 'dd/MM/yyyy'),
                    dayName: format(startDate, 'EEEE'),
                    dayCount: startDate.getDate(),
                  });
                  startDate.setDate(startDate.getDate() + 1);
                }
              } else if (lastDate <= currentDateAttStatus) {
                // If matched, push the range from 'fromdate' to 'todate'
                const startDate = new Date(joiningDate);
                // Loop through the dates in the range
                while (startDate <= lastDate) {
                  userDates.push({
                    formattedDate: format(startDate, 'dd/MM/yyyy'),
                    dayName: format(startDate, 'EEEE'),
                    dayCount: startDate.getDate(),
                  });
                  startDate.setDate(startDate.getDate() + 1);
                }
              }
            }
          });
        } else {
          const [year2, month2, day2] = item.doj?.split('-').map(Number);
          const joiningDate = new Date(year2, month2 - 1, day2);
          // Calculate the start date of the month based on the selected month
          const startDate = new Date(isyear, ismonth - 1, 1);
  
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(endDate.getDate() - 1);
  
          if (joiningDate < startDate) {
            // Check if the shift date is before or equal to the current date
            if (endDate >= currentDateAttStatus) {
              let currentDate1 = new Date(startDate);
  
              while (currentDate1 <= endDate) {
                userDates.push({
                  formattedDate: format(currentDate1, 'dd/MM/yyyy'),
                  dayName: format(currentDate1, 'EEEE'),
                  dayCount: currentDate1.getDate(),
                });
                currentDate1.setDate(currentDate1.getDate() + 1);
              }
            } else if (endDate <= currentDateAttStatus) {
              let currentDate1 = new Date(startDate);
  
              while (currentDate1 <= endDate) {
                userDates.push({
                  formattedDate: format(currentDate1, 'dd/MM/yyyy'),
                  dayName: format(currentDate1, 'EEEE'),
                  dayCount: currentDate1.getDate(),
                });
                currentDate1.setDate(currentDate1.getDate() + 1);
              }
            }
          } else {
            // Check if the shift date is before or equal to the current date
            if (endDate >= currentDateAttStatus) {
              // If matched, push the range from 'fromdate' to 'todate'
              const startDate = new Date(joiningDate);
              // Loop through the dates in the range
              while (startDate <= currentDateAttStatus) {
                userDates.push({
                  formattedDate: format(startDate, 'dd/MM/yyyy'),
                  dayName: format(startDate, 'EEEE'),
                  dayCount: startDate.getDate(),
                });
                startDate.setDate(startDate.getDate() + 1);
              }
            } else if (endDate <= currentDateAttStatus) {
              let currentDate1 = new Date(startDate);
  
              while (currentDate1 <= endDate) {
                userDates.push({
                  formattedDate: format(currentDate1, 'dd/MM/yyyy'),
                  dayName: format(currentDate1, 'EEEE'),
                  dayCount: currentDate1.getDate(),
                });
                currentDate1.setDate(currentDate1.getDate() + 1);
              }
            }
          }
        }
  
        item.shiftallot?.map((allot) => {
          resultshiftallot.push({ ...allot });
        });
  
        const filteredMatchingDoubleShiftItem = resultshiftallot?.filter((val) => val && val.empcode === item.empcode && val.adjstatus === 'Approved');
  
        // Filter out the dates that have matching 'Shift Adjustment' todates
        let removedUserDates = userDates.filter((date) => {
          // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
          const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem.find((item) => item && item.todate === date.formattedDate && item.adjustmenttype === 'Shift Adjustment');
  
          // If there is no matching 'Shift Adjustment', keep the date
          return !matchingShiftAdjustmentToDate;
        });
  
        // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
        let uniqueEntries = new Set();
  
        // Iterate over removedUserDates and add unique entries to the Set
        removedUserDates.forEach((date) => {
          uniqueEntries.add(
            JSON.stringify({
              formattedDate: date.formattedDate,
              dayName: date.dayName,
              dayCount: date.dayCount,
              shiftMode: 'Main Shift',
              weekNumberInMonth: date.weekNumberInMonth,
            })
          );
        });
  
        // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
        filteredMatchingDoubleShiftItem.forEach((item) => {
          const [day, month, year] = item._doc.adjdate?.split('/');
          let newFormattedDate = new Date(`${year}-${month}-${day}`);
  
          if (item._doc.adjustmenttype === 'Shift Adjustment' || item._doc.adjustmenttype === 'Add On Shift' || item._doc.adjustmenttype === 'Shift Weekoff Swap') {
            uniqueEntries.add(
              JSON.stringify({
                formattedDate: item._doc.adjdate,
                dayName: moment(item._doc.adjdate, 'DD/MM/YYYY').format('dddd'),
                dayCount: parseInt(moment(item._doc.adjdate, 'DD/MM/YYYY').format('DD')),
                shiftMode: 'Second Shift',
                weekNumberInMonth:
                  getWeekNumberInMonth(newFormattedDate) === 1
                    ? `${getWeekNumberInMonth(newFormattedDate)}st Week`
                    : getWeekNumberInMonth(newFormattedDate) === 2
                    ? `${getWeekNumberInMonth(newFormattedDate)}nd Week`
                    : getWeekNumberInMonth(newFormattedDate) === 3
                    ? `${getWeekNumberInMonth(newFormattedDate)}rd Week`
                    : getWeekNumberInMonth(newFormattedDate) > 3
                    ? `${getWeekNumberInMonth(newFormattedDate)}th Week`
                    : '',
              })
            );
          }
        });
  
        // Convert Set back to an array of objects
        let createdUserDatesUnique = Array.from(uniqueEntries).map((entry) => JSON.parse(entry));
  
        function sortUserDates(dates) {
          return dates.sort((a, b) => {
            if (a.formattedDate === b.formattedDate) {
              // If dates are the same, sort by shift mode
              if (a.shiftMode < b.shiftMode) return -1;
              if (a.shiftMode > b.shiftMode) return 1;
              return 0;
            } else {
              // Otherwise, sort by date
              const dateA = new Date(a.formattedDate.split('/').reverse().join('/'));
              const dateB = new Date(b.formattedDate.split('/').reverse().join('/'));
              return dateA - dateB;
            }
          });
        }
  
        // Sort the array
        const sortedCreatedUserDates = sortUserDates(createdUserDatesUnique);
        const createdUserDates = sortedCreatedUserDates?.filter((d) => {
          const filterData = userDates.some((val) => val.formattedDate === d.formattedDate);
          if (filterData) {
            return d;
          }
        });
  
        // Map each user date to a row
        const userRows = createdUserDates?.map((date) => {
          let filteredRowData = resultshiftallot?.filter((val) => val.empcode == item.empcode);
          const matchingItem = filteredRowData?.find((item) => item && item.adjdate == date.formattedDate);
          const matchingItemAllot = filteredRowData?.find((item) => item && formatDate(item.date) == date.formattedDate);
          const matchingDoubleShiftItem = filteredRowData.find((item) => item && item.todate === date.formattedDate);
  
          const matchingRemovedItem = item.shiftallot?.find((item) => item.removedshiftdate === date.formattedDate);
  
          const matchingAssignShiftItem = item.shiftallot?.find((item) => item.adjdate === date.formattedDate && item.adjstatus === 'Approved' && item.adjustmenttype === 'Assign Shift');
  
          const filterBoardingLog =
            item.boardingLog &&
            item.boardingLog?.filter((item) => {
              return item.logcreation === 'user' || item.logcreation === 'shift';
              // return item;
            });
          let attendanceFiltered = attendance.filter((d) => d.username === item.username);
  
          const depMonthSetFiltered = depMonthSet.filter((d) => d.department === item.department);
          // Check if the dayName is Sunday or Monday
          // const isWeekOff = item.weekoff?.includes(date.dayName);
          const isWeekOff = getWeekOffDay(date, filterBoardingLog, item.departmentlog, depMonthSetFiltered) === 'Week Off' ? true : false;
          const isWeekOffWithAdjustment = isWeekOff && matchingItem;
          const isWeekOffWithManual = isWeekOff && matchingItemAllot;
  
          const row = {
            id: `${item._id.toString()}_${date.formattedDate}_${date.shiftMode}`,
            userid: item._id.toString(),
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.companyname,
            empcode: item.empcode,
            weekoff: item.weekoff,
            boardingLog: item.boardingLog,
            shiftallot: item.shiftallot,
            doj: item.doj,
            shift: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered),
            date: `${date.formattedDate} ${date.dayName} ${date.dayCount}`,
            role: item.role,
            rowformattedDate: date.formattedDate,
            dayName: date.dayName,
            shiftMode: date.shiftMode,
            reasondate: item.reasondate,
              clockin: checkGetClockInTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
          clockout: checkGetClockOutTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
          clockinstatus: checkClockInStatus(
            checkGetClockInTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem),
            graceTime,
            allLeaveStatus,
            holidays,
            checkGetClockInDate(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            item?.branch,
            item?.empcode,
            item?.company,
            date.formattedDate,
            item?.unit,
            item?.team,
            item?.companyname,
            earlyclockin,
            lateclockin,
            afterlateclockin,
            leavetype,
            permission,
            checkGetClockOutTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            leavecriterias,
            date.weekNumberInMonth,
            date.dayName,
            item?.department,
            item?.designation
          ),
          clockoutstatus: checkClockOutStatus(
            checkGetClockOutTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            checkGetClockInTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem),
            clockOutHours,
            checkGetClockInDate(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            allLeaveStatus,
            holidays,
            item?.branch,
            item?.empcode,
            item?.company,
            date.formattedDate,
            item?.unit,
            item?.team,
            item?.companyname,
            onclockout,
            earlyclockout,
            beforeearlyclockout,
            checkGetClockInAutoStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            leavetype,
            permission,
            date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            leavecriterias,
            date.weekNumberInMonth,
            date.dayName,
            item?.department,
            item?.designation
          ),
          attendanceautostatus: checkAttendanceStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
          lateclockincount: lateclockincount,
          earlyclockoutcount: earlyclockoutcount,
          totalnumberofdays: getTotalMonthDaysUser(item?.department, depMonthSet, ismonth, isyear),
          empshiftdays: getTotalMonthDaysForEmpUser(item.doj, item?.department, depMonthSet, ismonth, isyear),
          totalcounttillcurrendate: getTotalMonthsCurrentDateCountUserPayrun(item.doj, item?.department, depMonthSet, ismonth, isyear, item.reasondate),
          totalshift: getTotalShiftHoursUser(item?._id.toString(), createdUserDates, attendance),
          weekoffpresentstatus: checkWeekOffPresentStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
       
            // clockin: checkGetClockInTime(
            //   attendanceFiltered,
            //   item._id.toString(),
            //   date.formattedDate,
            //   getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered),
            //   date.shiftMode
            // ),
            // clockout: checkGetClockOutTime(
            //   attendanceFiltered,
            //   item._id.toString(),
            //   date.formattedDate,
            //   getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered),
            //   date.shiftMode
            // ),
          
            // clockinstatus: checkClockInStatus(
            //   checkGetClockInTime(
            //     attendanceFiltered,
            //     item._id.toString(),
            //     date.formattedDate,
            //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
            //     date.shiftMode
            //   ),
            //   getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
            //   graceTime,
            //   allLeaveStatus,
            //   holidays,
            //   checkGetClockInDate(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
            //   item.branch,
            //   item.empcode,
            //   item.company,
            //   date.formattedDate,
            //   item.unit,
            //   item.team,
            //   item.companyname,
            //   earlyclockin,
            //   lateclockin,
            //   afterlateclockin,
            //   leavetype,
            //   permission,
            //   checkGetClockOutTime(
            //     attendanceFiltered,
            //     item._id.toString(),
            //     date.formattedDate,
            //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
            //     date.shiftMode
            //   ),
            //   date.shiftMode,
            //   checkWeekOffPresentStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
            //   leavecriterias,
            //   date.weekNumberInMonth,
            //   date.dayName,
            //   item.department,
            //   item.designation
            // ),
            // clockoutstatus: checkClockOutStatus(
            //   checkGetClockOutTime(
            //     attendanceFiltered,
            //     item._id.toString(),
            //     date.formattedDate,
            //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
            //     date.shiftMode
            //   ),
            //   checkGetClockInTime(
            //     attendanceFiltered,
            //     item._id.toString(),
            //     date.formattedDate,
            //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
            //     date.shiftMode
            //   ),
            //   getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
            //   clockOutHours,
            //   checkGetClockInDate(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
            //   allLeaveStatus,
            //   holidays,
            //   item.branch,
            //   item.empcode,
            //   item.company,
            //   date.formattedDate,
            //   item.unit,
            //   item.team,
            //   item.companyname,
            //   onclockout,
            //   earlyclockout,
            //   beforeearlyclockout,
            //   checkGetClockInAutoStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
            //   leavetype,
            //   permission,
            //   date.shiftMode,
            //   checkWeekOffPresentStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
            //   leavecriterias,
            //   date.weekNumberInMonth,
            //   date.dayName,
            //   item.department,
            //   item.designation
            // ),
            // attendanceautostatus: checkAttendanceStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
            // lateclockincount: lateclockincount,
            // earlyclockoutcount: earlyclockoutcount,
            // totalnumberofdays: getTotalMonthDaysUser(item.department, depMonthSetFiltered, ismonth, isyear),
            // empshiftdays: getTotalMonthDaysForEmpUser(item.doj, item.department, depMonthSetFiltered, ismonth, isyear),
            // totalcounttillcurrendate: getTotalMonthsCurrentDateCountUser(item.doj, item.department, depMonthSetFiltered, ismonth, isyear),
            // totalshift: getTotalShiftHoursUser(item._id.toString(), createdUserDates, attendanceFiltered),
            // weekoffpresentstatus: checkWeekOffPresentStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
          };
          return row;
        });
  
        return userRows;
      });
   
  finaluser = finaluser.filter(d => d != null)
  // console.log(finaluser.length,"final")
    } catch (err) {
    console.log(err, 'errrmini');
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({ finaluser });
});


exports.getAllUserTotalShiftDaysHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let resultshiftallot = [];
  let graceTime;
  let clockOutHours;
  let lateclockincount;
  let earlyclockoutcount;
  let onclockout;
  let earlyclockin;
  let earlyclockout;
  let lateclockin;
  let afterlateclockin;
  let beforeearlyclockout;
  let finaluser = [];
  const {
    ismonth,
    isyear,
    pageSize,
    page,
    // employees
  } = req.body;

  try {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let querydeptmonth = {
      monthname: monthNames[ismonth - 1],
      year: isyear,
    };
    let [usersAll, depMonthSet, controlcriteria, holidays, leavetype] = await Promise.all([
      User.find(
        {
          // resonablestatus: {
          //     $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
          // },

          enquirystatus: {
            $nin: ['Enquiry Purpose'],
          },
            companyname:{$in:req.body.hierarchyempnames},
        },
        {}
      )
        .skip((page - 1) * pageSize)
        .limit(pageSize),

      DepartmentMonth.find(querydeptmonth, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 }),
      ControlCriteria.find(),
      Holiday.find({}, { date: 1, company: 1, applicablefor: 1, unit: 1, team: 1, employee: 1, noofdays: 1 }),
      Leavetype.find({}, { leavetype: 1, code: 1 }),
    ]);

    const resultDateArray = depMonthSet.reduce(
      (acc, curr) => {
        // Compare and update the earliest fromdate
        if (new Date(curr.fromdate) < new Date(acc.fromdate)) {
          acc.fromdate = curr.fromdate;
        }
        // Compare and update the latest todate
        if (new Date(curr.todate) > new Date(acc.todate)) {
          acc.todate = curr.todate;
        }
        return acc;
      },
      {
        fromdate: depMonthSet[0].fromdate, // Start with the first fromdate
        todate: depMonthSet[0].todate, // Start with the first todate
      }
    );

    function formatDate(dateString) {
      const [day, month, year] = dateString.split('-');
      return `${year}-${month}-${day}`;
    }

    let attFromDate = resultDateArray.fromdate;
    let attToDate = resultDateArray.todate;
    const fromDateSet = [...new Set(depMonthSet.map((d) => d.fromdate))];

    let users = usersAll
      .map((item) => {
        let findUserDeprtment = item.department;

        if (item.departmentlog && item.departmentlog.length > 1) {
          // const findDept = item.departmentlog.find(dept => fromDateSet.includes(dept.startdate) );
          const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));

          const findDept = sortedDepartmentLog.find((dept) => fromDateSet.includes(dept.startdate) || fromDateSet.some((fromDate) => new Date(fromDate) > new Date(dept.startdate)));
          findUserDeprtment = findDept ? findDept.department : '';
        } else if (item.departmentlog && item.departmentlog.length > 0) {
          findUserDeprtment = new Date(item.doj) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : '';
        }

        // if (department.includes(findUserDeprtment)) {
        return {
          ...item._doc, // Use _doc to avoid including Mongoose metadata
          department: findUserDeprtment,
        };

        // }

        // return null; // Exclude users who don't match the department
      })
      .filter((item) => item !== null && item != undefined);

    const userIds = users.map((user) => user._id);
    const userCds = users.map((user) => user.companyname);
    // const [attendance, allLeaveStatus, permission,] = await Promise.all([
    //   Attendance.find({ userid: { $in: userIds }, createdAt: { $gte: attFromDate, $lte: attToDate } }),
    //   ApplyLeave.find({ employeename: { $in: userCds } }),
    //   Permission.find({ employeename: { $in: userCds } }, { employeeid: 1, date: 1, status: 1, applytype: 1, compensationstatus: 1, compensationapplytype: 1, requesthours: 1, shiftmode: 1 }),
  
    // ]);
     const [attendance, allLeaveStatus, permission, leavecriterias] = await Promise.all([
        Attendance.find({ userid: { $in: userIds }, createdAt: { $gte: attFromDate, $lte: attToDate } }),
        ApplyLeave.find({ employeename: { $in: userCds } }),
        Permission.find({ employeename: { $in: userCds } }, { employeeid: 1, date: 1, status: 1, applytype: 1, compensationstatus: 1, compensationapplytype: 1, requesthours: 1 }),
        Leavecriteria.find({ leavetype: 'No Call/No Show' }, { mode: 1, company: 1, branch: 1, unit: 1, team: 1, employee: 1, designation: 1, department: 1, leavetype: 1, tookleave: 1 }),
      ]);

    clockOutHours = controlcriteria[0].clockout;
    lateclockincount = controlcriteria[0].lateclockincount;
    earlyclockoutcount = controlcriteria[0].earlyclockoutcount;
    onclockout = controlcriteria[0].onclockout;
    earlyclockin = controlcriteria[0].earlyclockin;
    lateclockin = controlcriteria[0].lateclockin;
    earlyclockout = controlcriteria[0].earlyclockout;
    afterlateclockin = controlcriteria[0].afterlateclockin;
    beforeearlyclockout = controlcriteria[0].afterlateclockin;

    finaluser = users?.flatMap((item, index) => {
      let isEmployeeGrace = controlcriteria[0].todos && controlcriteria[0].todos.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.team === item.team && d.employeename === item.companyname);

      if (isEmployeeGrace) {
        graceTime = isEmployeeGrace.employeegracetime;
      } else {
        graceTime = controlcriteria[0].gracetime;
      }

      let userDates = [];

      // Remove duplicate entries with the most recent entry
      const uniqueEntriesDep = {};
      item.departmentlog?.forEach((entry) => {
        const entryDate = new Date(entry.startdate); // Parse the startdate into a date object
        const key = entry.startdate;

        if (!(key in uniqueEntriesDep)) {
          uniqueEntriesDep[key] = entry;
        }
      });

      const comparedDate = depMonthSet?.filter((d) => d.department === item.department);
      const dojDate = item?.boardingLog.length > 0 ? item?.boardingLog[0].startdate : item?.doj;

      if (comparedDate && comparedDate.length > 0) {
        comparedDate?.forEach((dep) => {
          if (!dep.fromdate && !dep.todate) {
            return '';
          }

          if (!item.doj) {
            return '';
          }

          const [year2, month2, day2] = dojDate?.split('-').map(Number);
          const joiningDate = new Date(year2, month2 - 1, day2);
          const [year1, month1, day1] = dep.fromdate?.split('-').map(Number);
          const [year, month, day] = dep.todate?.split('-').map(Number);
          const lastDate = new Date(year, month - 1, day);
          const firstDate = new Date(year1, month1 - 1, day1);

          if (joiningDate < firstDate) {
            // Check if the shift date is before or equal to the current date
            if (lastDate >= currentDateAttStatus) {
              // If matched, push the range from 'fromdate' to 'todate'
              const startDate = new Date(firstDate);
              // Loop through the dates in the range
              while (startDate <= currentDateAttStatus) {
                userDates.push({
                  formattedDate: format(startDate, 'dd/MM/yyyy'),
                  dayName: format(startDate, 'EEEE'),
                  dayCount: startDate.getDate(),
                });
                startDate.setDate(startDate.getDate() + 1);
              }
            } else if (lastDate <= currentDateAttStatus) {
              // If matched, push the range from 'fromdate' to 'todate'
              const startDate = new Date(firstDate);
              // Loop through the dates in the range
              while (startDate <= lastDate) {
                userDates.push({
                  formattedDate: format(startDate, 'dd/MM/yyyy'),
                  dayName: format(startDate, 'EEEE'),
                  dayCount: startDate.getDate(),
                });
                startDate.setDate(startDate.getDate() + 1);
              }
            }
          } else {
            // Check if the shift date is before or equal to the current date
            if (lastDate >= currentDateAttStatus) {
              // If matched, push the range from 'fromdate' to 'todate'
              const startDate = new Date(joiningDate);
              // Loop through the dates in the range
              while (startDate <= currentDateAttStatus) {
                userDates.push({
                  formattedDate: format(startDate, 'dd/MM/yyyy'),
                  dayName: format(startDate, 'EEEE'),
                  dayCount: startDate.getDate(),
                });
                startDate.setDate(startDate.getDate() + 1);
              }
            } else if (lastDate <= currentDateAttStatus) {
              // If matched, push the range from 'fromdate' to 'todate'
              const startDate = new Date(joiningDate);
              // Loop through the dates in the range
              while (startDate <= lastDate) {
                userDates.push({
                  formattedDate: format(startDate, 'dd/MM/yyyy'),
                  dayName: format(startDate, 'EEEE'),
                  dayCount: startDate.getDate(),
                });
                startDate.setDate(startDate.getDate() + 1);
              }
            }
          }
        });
      } else {
        const [year2, month2, day2] = dojDate?.split('-').map(Number);
        const joiningDate = new Date(year2, month2 - 1, day2);
        // Calculate the start date of the month based on the selected month
        const startDate = new Date(isyear, ismonth - 1, 1);

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(endDate.getDate() - 1);

        if (joiningDate < startDate) {
          // Check if the shift date is before or equal to the current date
          if (endDate >= currentDateAttStatus) {
            let currentDate1 = new Date(startDate);

            while (currentDate1 <= endDate) {
              userDates.push({
                formattedDate: format(currentDate1, 'dd/MM/yyyy'),
                dayName: format(currentDate1, 'EEEE'),
                dayCount: currentDate1.getDate(),
              });
              currentDate1.setDate(currentDate1.getDate() + 1);
            }
          } else if (endDate <= currentDateAttStatus) {
            let currentDate1 = new Date(startDate);

            while (currentDate1 <= endDate) {
              userDates.push({
                formattedDate: format(currentDate1, 'dd/MM/yyyy'),
                dayName: format(currentDate1, 'EEEE'),
                dayCount: currentDate1.getDate(),
              });
              currentDate1.setDate(currentDate1.getDate() + 1);
            }
          }
        } else {
          // Check if the shift date is before or equal to the current date
          if (endDate >= currentDateAttStatus) {
            // If matched, push the range from 'fromdate' to 'todate'
            const startDate = new Date(joiningDate);
            // Loop through the dates in the range
            while (startDate <= currentDateAttStatus) {
              userDates.push({
                formattedDate: format(startDate, 'dd/MM/yyyy'),
                dayName: format(startDate, 'EEEE'),
                dayCount: startDate.getDate(),
              });
              startDate.setDate(startDate.getDate() + 1);
            }
          } else if (endDate <= currentDateAttStatus) {
            let currentDate1 = new Date(startDate);

            while (currentDate1 <= endDate) {
              userDates.push({
                formattedDate: format(currentDate1, 'dd/MM/yyyy'),
                dayName: format(currentDate1, 'EEEE'),
                dayCount: currentDate1.getDate(),
              });
              currentDate1.setDate(currentDate1.getDate() + 1);
            }
          }
        }
      }

      item.shiftallot?.map((allot) => {
        resultshiftallot.push({ ...allot });
      });

      const filteredMatchingDoubleShiftItem = resultshiftallot?.filter((val) => val && val.empcode === item.empcode && val.adjstatus === 'Approved');

      // Filter out the dates that have matching 'Shift Adjustment' todates
      let removedUserDates = userDates.filter((date) => {
        // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
        const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem.find((item) => item && item.todate === date.formattedDate && item.adjustmenttype === 'Shift Adjustment');

        // If there is no matching 'Shift Adjustment', keep the date
        return !matchingShiftAdjustmentToDate;
      });

      // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
      let uniqueEntries = new Set();

      // Iterate over removedUserDates and add unique entries to the Set
      userDates.forEach((date) => {
        uniqueEntries.add(
          JSON.stringify({
            formattedDate: date.formattedDate,
            dayName: date.dayName,
            dayCount: date.dayCount,
            shiftMode: 'Main Shift',
            weekNumberInMonth: date.weekNumberInMonth,
          })
        );
      });

      // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
      filteredMatchingDoubleShiftItem.forEach((item) => {
        const [day, month, year] = item._doc.adjdate?.split('/');
        let newFormattedDate = new Date(`${year}-${month}-${day}`);

        if (item._doc.adjustmenttype === 'Shift Adjustment' || item._doc.adjustmenttype === 'Add On Shift' || item._doc.adjustmenttype === 'Shift Weekoff Swap') {
          uniqueEntries.add(
            JSON.stringify({
              formattedDate: item._doc.adjdate,
              dayName: moment(item._doc.adjdate, 'DD/MM/YYYY').format('dddd'),
              dayCount: parseInt(moment(item._doc.adjdate, 'DD/MM/YYYY').format('DD')),
              shiftMode: 'Second Shift',
              weekNumberInMonth:
                getWeekNumberInMonth(newFormattedDate) === 1
                  ? `${getWeekNumberInMonth(newFormattedDate)}st Week`
                  : getWeekNumberInMonth(newFormattedDate) === 2
                  ? `${getWeekNumberInMonth(newFormattedDate)}nd Week`
                  : getWeekNumberInMonth(newFormattedDate) === 3
                  ? `${getWeekNumberInMonth(newFormattedDate)}rd Week`
                  : getWeekNumberInMonth(newFormattedDate) > 3
                  ? `${getWeekNumberInMonth(newFormattedDate)}th Week`
                  : '',
            })
          );
        }
      });

      // Convert Set back to an array of objects
      let createdUserDatesUnique = Array.from(uniqueEntries).map((entry) => JSON.parse(entry));

      function sortUserDates(dates) {
        return dates.sort((a, b) => {
          if (a.formattedDate === b.formattedDate) {
            // If dates are the same, sort by shift mode
            if (a.shiftMode < b.shiftMode) return -1;
            if (a.shiftMode > b.shiftMode) return 1;
            return 0;
          } else {
            // Otherwise, sort by date
            const dateA = new Date(a.formattedDate.split('/').reverse().join('/'));
            const dateB = new Date(b.formattedDate.split('/').reverse().join('/'));
            return dateA - dateB;
          }
        });
      }

      // Sort the array
      const sortedCreatedUserDates = sortUserDates(createdUserDatesUnique);
      const createdUserDates = sortedCreatedUserDates?.filter((d) => {
        const filterData = userDates.some((val) => val.formattedDate === d.formattedDate);
        if (filterData) {
          return d;
        }
      });

      // Map each user date to a row
      const userRows = createdUserDates?.map((date) => {
        let filteredRowData = resultshiftallot?.filter((val) => val.empcode == item.empcode);
        const matchingItem = filteredRowData?.find((item) => item && item.adjdate == date.formattedDate);
        const matchingItemAllot = filteredRowData?.find((item) => item && formatDate(item.date) == date.formattedDate);
        const matchingDoubleShiftItem = filteredRowData?.find((item) => item && item.todate === date.formattedDate);
        const matchingRemovedItem = filteredRowData?.find((item) => item?._doc?.removedshiftdate === date.formattedDate);
        const matchingAssignShiftItem = filteredRowData?.find((item) => item?._doc?.adjdate === date.formattedDate && item?._doc?.adjstatus === 'Approved' && item?._doc?.adjustmenttype === 'Assign Shift');

        const filterBoardingLog =
          item.boardingLog &&
          item.boardingLog?.filter((item) => {
            return item.logcreation === 'user' || item.logcreation === 'shift';
            // return item;
          });
        let attendanceFiltered = attendance.filter((d) => d.username === item.username);

        const depMonthSetFiltered = depMonthSet.filter((d) => d.department === item.department);
        // Check if the dayName is Sunday or Monday
        // const isWeekOff = item.weekoff?.includes(date.dayName);
        const isWeekOff = getWeekOffDay(date, filterBoardingLog, item.departmentlog, depMonthSetFiltered) === 'Week Off' ? true : false;
        const isWeekOffWithAdjustment = isWeekOff && matchingItem;
        const isWeekOffWithManual = isWeekOff && matchingItemAllot;

        // const row = {
        //   id: `${item._id.toString()}_${date.formattedDate}_${date.shiftMode}`,
        //   userid: item._id.toString(),
        //   company: item.company,
        //   branch: item.branch,
        //   unit: item.unit,
        //   team: item.team,
        //   department: item.department,
        //   username: item.companyname,
        //   empcode: item.empcode,
        //   weekoff: item.weekoff,
        //   boardingLog: item.boardingLog,
        //   shiftallot: item.shiftallot,
        //   doj: dojDate,
        //   shift: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //   date: `${date.formattedDate} ${date.dayName} ${date.dayCount}`,
        //   role: item.role,
        //   rowformattedDate: date.formattedDate,
        //   dayName: date.dayName,
        //   shiftMode: date.shiftMode,
        //   reasondate: item.reasondate,
        //   clockin: checkGetClockInTime(
        //     attendanceFiltered,
        //     item._id.toString(),
        //     date.formattedDate,
        //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //     date.shiftMode
        //   ),
        //   clockout: checkGetClockOutTime(
        //     attendanceFiltered,
        //     item._id.toString(),
        //     date.formattedDate,
        //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //     date.shiftMode
        //   ),
        //   clockinstatus: checkClockInStatus(
        //     checkGetClockInTime(
        //       attendanceFiltered,
        //       item._id.toString(),
        //       date.formattedDate,
        //       getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //       date.shiftMode
        //     ),
        //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //     graceTime,
        //     allLeaveStatus,
        //     holidays,
        //     checkGetClockInDate(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
        //     item.branch,
        //     item.empcode,
        //     item.company,
        //     date.formattedDate,
        //     item.unit,
        //     item.team,
        //     item.companyname,
        //     earlyclockin,
        //     lateclockin,
        //     afterlateclockin,
        //     leavetype,
        //     permission,
        //     checkGetClockOutTime(
        //       attendanceFiltered,
        //       item._id.toString(),
        //       date.formattedDate,
        //       getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //       date.shiftMode
        //     ),
        //     date.shiftMode,
        //     checkWeekOffPresentStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode)
        //   ),
        //   clockoutstatus: checkClockOutStatus(
        //     checkGetClockOutTime(
        //       attendanceFiltered,
        //       item._id.toString(),
        //       date.formattedDate,
        //       getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //       date.shiftMode
        //     ),
        //     checkGetClockInTime(
        //       attendanceFiltered,
        //       item._id.toString(),
        //       date.formattedDate,
        //       getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //       date.shiftMode
        //     ),
        //     getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered, matchingRemovedItem, matchingAssignShiftItem),
        //     clockOutHours,
        //     checkGetClockInDate(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
        //     allLeaveStatus,
        //     holidays,
        //     item.branch,
        //     item.empcode,
        //     item.company,
        //     date.formattedDate,
        //     item.unit,
        //     item.team,
        //     item.companyname,
        //     onclockout,
        //     earlyclockout,
        //     beforeearlyclockout,
        //     checkGetClockInAutoStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
        //     leavetype,
        //     permission,
        //     date.shiftMode,
        //     checkWeekOffPresentStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode)
        //   ),
        //   attendanceautostatus: checkAttendanceStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
        //   lateclockincount: lateclockincount,
        //   earlyclockoutcount: earlyclockoutcount,
        //   totalnumberofdays: getTotalMonthDaysUser(item.department, depMonthSetFiltered, ismonth, isyear),
        //   empshiftdays: getTotalMonthDaysForEmpUser(dojDate, item.department, depMonthSetFiltered, ismonth, isyear),
        //   totalcounttillcurrendate: getTotalMonthsCurrentDateCountUser(dojDate, item.department, depMonthSetFiltered, ismonth, isyear),
        //   totalshift: getTotalShiftHoursUser(item._id.toString(), createdUserDates, attendanceFiltered),
        //   weekoffpresentstatus: checkWeekOffPresentStatus(attendanceFiltered, item._id.toString(), date.formattedDate, date.shiftMode),
        // };
       
        const row = {
            id: `${item._id.toString()}_${date.formattedDate}_${date.shiftMode}`,
            userid: item._id.toString(),
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.companyname,
            empcode: item.empcode,
            weekoff: item.weekoff,
            boardingLog: item.boardingLog,
            shiftallot: item.shiftallot,
            doj: item.doj,
            shift: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSetFiltered),
            date: `${date.formattedDate} ${date.dayName} ${date.dayCount}`,
            role: item.role,
            rowformattedDate: date.formattedDate,
            dayName: date.dayName,
            shiftMode: date.shiftMode,
            reasondate: item.reasondate,
              clockin: checkGetClockInTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
          clockout: checkGetClockOutTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
          clockinstatus: checkClockInStatus(
            checkGetClockInTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem),
            graceTime,
            allLeaveStatus,
            holidays,
            checkGetClockInDate(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            item?.branch,
            item?.empcode,
            item?.company,
            date.formattedDate,
            item?.unit,
            item?.team,
            item?.companyname,
            earlyclockin,
            lateclockin,
            afterlateclockin,
            leavetype,
            permission,
            checkGetClockOutTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            leavecriterias,
            date.weekNumberInMonth,
            date.dayName,
            item?.department,
            item?.designation
          ),
          clockoutstatus: checkClockOutStatus(
            checkGetClockOutTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            checkGetClockInTime(attendance, item?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem), date.shiftMode),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet, matchingRemovedItem, matchingAssignShiftItem),
            clockOutHours,
            checkGetClockInDate(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            allLeaveStatus,
            holidays,
            item?.branch,
            item?.empcode,
            item?.company,
            date.formattedDate,
            item?.unit,
            item?.team,
            item?.companyname,
            onclockout,
            earlyclockout,
            beforeearlyclockout,
            checkGetClockInAutoStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            leavetype,
            permission,
            date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
            leavecriterias,
            date.weekNumberInMonth,
            date.dayName,
            item?.department,
            item?.designation
          ),
          attendanceautostatus: checkAttendanceStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
          lateclockincount: lateclockincount,
          earlyclockoutcount: earlyclockoutcount,
          totalnumberofdays: getTotalMonthDaysUser(item?.department, depMonthSet, ismonth, isyear),
          empshiftdays: getTotalMonthDaysForEmpUser(item.doj, item?.department, depMonthSet, ismonth, isyear),
          totalcounttillcurrendate: getTotalMonthsCurrentDateCountUserPayrun(item.doj, item?.department, depMonthSet, ismonth, isyear, item.reasondate),
          totalshift: getTotalShiftHoursUser(item?._id.toString(), createdUserDates, attendance),
          weekoffpresentstatus: checkWeekOffPresentStatus(attendance, item?._id.toString(), date.formattedDate, date.shiftMode),
          };
       
        return row;
      });

      return userRows;
    });

    finaluser = finaluser.filter(t => t != null && t != undefined)

    // console.log(finaluser.length,"finaluser")
  } catch (err) {
    console.log(err,"errrmofmnsdfsjfdoj")
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({ finaluser });
});






//task
exports.getAllTaskForAssingnedhomeTeam = catchAsyncErrors(async (req, res, next) => {
  let fromdate, todate;
  const today = new Date();
  const selectedFilter = req.body.selectedfilter;

  // Utility function to format date as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${date}`;
  };

  // Set date ranges based on the selected filter
  switch (selectedFilter) {


    case "Last Month":
      fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
      todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
      break;
    case "Last Week":
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
      fromdate = formatDate(startOfLastWeek);
      todate = formatDate(endOfLastWeek);
      break;
    case "Yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      fromdate = todate = formatDate(yesterday);
      break;

    case "Today":
      fromdate = todate = formatDate(today);
      break;
    case "Tomorrow":
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      fromdate = todate = formatDate(tomorrow);
      break;
    case "This Week":
      const startOfThisWeek = new Date(today);
      startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
      const endOfThisWeek = new Date(startOfThisWeek);
      endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
      fromdate = formatDate(startOfThisWeek);
      todate = formatDate(endOfThisWeek);
      break;
    case "This Month":
      fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
      todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


      break;

    default:
      fromdate = "";
  }

  const from = moment.tz(fromdate, 'YYYY-MM-DD', 'Asia/Kolkata').startOf('day').toDate();
  const to = moment.tz(todate, 'YYYY-MM-DD', 'Asia/Kolkata').endOf('day').toDate();

// console.log(from,to,fromdate,todate,"dfdf")

  let taskforuser;

  try {
    const statuses = ["Assigned", "Pending", "Finished By Others", "Not Applicable to Me", "Postponed", "Paused", "Completed"];

 


    const [
      taskforuserAssigned,
      taskforuserPending,
      taskforuserFinished,
      taskforuserApplicable,
      taskforuserPostponed,
      taskforuserPaused,
      taskforuserCompleted
    ] = await Promise.all(
      statuses.map(status => TaskForUser.countDocuments({
        ...(fromdate && todate
          ? { formattedDate: { $gte: from, $lte: to } }
          : fromdate
            ? { formattedDate: { $eq: from } }
            : {}),
        taskstatus: status,
           username:{$in:req.body.hierarchyempnames}
      }))
    );

    taskforuser = {
      taskforuserAssigned,
      taskforuserPending,
      taskforuserFinished,
      taskforuserApplicable,
      taskforuserPostponed,
      taskforuserPaused,
      taskforuserCompleted
    }



    return res.status(200).json({
      taskforuser
    });
  } catch (err) {
    console.log(err,"erretask")
    return next(new ErrorHandler("Records not found!", 404));
  }
});




exports.getAllTaskUserReportsTeam = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects, overall;
  const { frequency, status, fromdate, todate, page, pageSize, allFilters, logicOperator, searchQuery } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  let query = {};
  let Overallquery = {};
  const from = moment.tz(req.body.fromdate, 'YYYY-MM-DD', 'Asia/Kolkata').startOf('day').toDate();
  const to = moment.tz(req.body.todate, 'YYYY-MM-DD', 'Asia/Kolkata').endOf('day').toDate();

  if (frequency?.length > 0) {
    query.frequency = { $in: frequency };
    Overallquery.frequency = { $in: frequency };
  }
  if (status?.length > 0) {
    query.taskstatus = { $in: status };
    Overallquery.taskstatus = { $in: status };
  }

  if (fromdate && todate) {
    query = {
      ...query,
      formattedDate: {
        $gte: from,
        $lte: to,
      },
       username:{$in:req.body.hierarchyempnames}
    };

    Overallquery = {
      ...Overallquery,
      formattedDate: {
        $gte: from,
        $lte: to,
      },
         username:{$in:req.body.hierarchyempnames}
    };
  }
console.log(query,"query")
  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach((filter) => {
      if (filter.column && filter.condition && (filter.value || ['Blank', 'Not Blank'].includes(filter.condition))) {
        conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
      }
    });
  }
  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(' ');
    const regexTerms = searchTermsArray.map((term) => new RegExp(term, 'i'));
    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { taskstatus: regex },
        { taskassigneddate: regex },
        { taskdate: regex },
        { taskdetails: regex },
        { frequency: regex },
        { completedbyuser: regex },
        { userdescription: regex },
        { category: regex },
        { subcategory: regex },
        { duration: regex },
        { breakup: regex },
        { required: { $in: regex } },
        { schedule: regex },
      ],
    }));

    query = {
      ...query,
      $and: [...orConditions],
    };
  }

  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === 'AND') {
      query.$and = conditions;
    } else if (logicOperator === 'OR') {
      query.$or = conditions;
    }
  }

  try {
    // First, count the total number of projects matching the frequency criteria
    totalProjects = await TaskForUser.countDocuments(query);
    overall = await TaskForUser.find(Overallquery, {
      category: 1,
      subcategory: 1,
      frequency: 1,
      schedule: 1,
      username: 1,
      date: 1,
      shiftEndTime: 1,
      taskdetails: 1,
      timetodo: 1,
      description: 1,
      taskstatus: 1,
      taskassigneddate: 1,
      taskdate: 1,
      taskassign: 1,
      breakup: 1,
      assignId: 1,
      monthdate: 1,
      weekdays: 1,
      tasktime: 1,
      annumonth: 1,
      required: 1,
      duration: 1,
      priority: 1,
    }).lean();

    // Then, find the projects with pagination
    result = await TaskForUser.find(query, {
      category: 1,
      subcategory: 1,
      frequency: 1,
      schedule: 1,
      username: 1,
      date: 1,
      shiftEndTime: 1,
      taskdetails: 1,
      timetodo: 1,
      description: 1,
      taskstatus: 1,
      tasktime: 1,
      taskassigneddate: 1,
      timetodo: 1,
      taskdate: 1,
      taskassign: 1,
      breakup: 1,
      assignId: 1,
      monthdate: 1,
      weekdays: 1,
      annumonth: 1,
      required: 1,
      duration: 1,
      priority: 1,
    })
      .lean()
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      totalProjects,
      currentPage: page,
      result,
      overall,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.log(err, 'err');
    return next(new ErrorHandler('Records not found!', 404));
  }
});



//maintenance


exports.getAllSortedTaskMaintenanceForUserHomeTeam = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser, taskmaintenanceforuserstatus, filteruser, result, maintenancenonschedule;


    try {

        const dayvalue = req.body.selectedFilter; // Change to "Today" for today's values

      
        function getDatesForDayValue(dayvalue) {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            if (dayvalue === "Last Month") {
                // Last Month
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                let day = [];
                let date = [];
                let fulldate = [];
                let currentDate = new Date(startOfLastMonth);
                while (currentDate <= endOfLastMonth) {
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Last Week") {
                // Last Week (Monday to Sunday)
                const lastWeekStart = new Date(today);
                lastWeekStart.setDate(today.getDate() - dayOfWeek - 6); // Monday of last week
                let day = [];
                let date = [];
                let fulldate = [];
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(lastWeekStart);
                    currentDate.setDate(lastWeekStart.getDate() + i);
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Yesterday") {
                // Yesterday
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const day = [daysOfWeek[yesterday.getDay()]];
                const date = [yesterday.getDate()];
                const fulldate = [yesterday.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            }
            else if (dayvalue === "Today") {
                // Today
                const day = [daysOfWeek[dayOfWeek]];
                const date = [today.getDate()];
                const fulldate = [today.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            } else if (dayvalue === "Tomorrow") {
                // Tomorrow
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const day = [daysOfWeek[tomorrow.getDay()]];
                const date = [tomorrow.getDate()];
                const fulldate = [tomorrow.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            } else if (dayvalue === "This Week") {
                // This Week (Monday to Sunday)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Adjust to Monday
                let day = [];
                let date = [];
                let fulldate = [];
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfWeek);
                    currentDate.setDate(startOfWeek.getDate() + i);
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            } else if (dayvalue === "This Month") {
                // This Month
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                let day = [];
                let date = [];
                let fulldate = [];
                let currentDate = new Date(startOfMonth);
                while (currentDate <= endOfMonth) {
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }

        }


        // Example usage:
        const { day, date, fulldate, fulldatewithdays } = getDatesForDayValue(dayvalue);
        
        
         const branchFilter = req.body.assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
     unit: branchObj.unit
    }));

    let QueryTaskMaintenance = { $or: branchFilter };
    
       const branchFilterNonSchedule = req.body.assignbranch.map((branchObj) => ({
      branchto: branchObj.branch,
      companyto: branchObj.company,
     unitto: branchObj.unit
    }));
 QueryTaskMaintenance.employeenameto= {$in: req.body.hierarchyempnames }
  let QueryTaskMaintenanceNonSchedule = { $or: branchFilterNonSchedule };
 QueryTaskMaintenanceNonSchedule.employeenames= {$in: req.body.hierarchyempnames }
        taskmaintenanceforuser = await Maintenance.find(QueryTaskMaintenance, { employeenameto: 1, assetmaterial: 1, weekdays: 1, monthdate: 1, annumonth: 1, annuday: 1, frequency: 1, schedule: 1, timetodo: 1, });

        maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find(QueryTaskMaintenanceNonSchedule, { assetmaterial: 1, schedule: 1, date: 1, type: 1, employeenames: 1 });

        let combinedData = [...taskmaintenanceforuser, ...maintenancenonschedule]
        
        // console.log(combinedData,"combinedData")

        filteruser = combinedData.map(d => {
            const monthdateAsNumber = parseInt(d.monthdate, 10);
            const isToday = (dayvalue === "Today" && ((d.type && fulldate.includes(d.date)) || d.frequency === "Daily"

                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));


            const isTomorrow = (dayvalue === "Tomorrow" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisWeek = (dayvalue === "This Week" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisMonth = (dayvalue === "This Month" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));
            // Add logging for debugging

            if (isToday) {
                return { ...d._doc, date: fulldate[0] };
            } else if (isTomorrow) {
                return { ...d._doc, date: fulldate[0] };
            } else if (isThisWeek) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            } else if (isThisMonth) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            } else {
                return null;
            }
        }).filter(Boolean);  // Filter out null values

        let result1 = [];
filteruser = filteruser.map(t => ({
  ...t,
  employeenames: (t.employeenames || []).filter(item => req.body.hierarchyempnames.includes(item))
}));
                 filteruser.forEach(d => {
            d.type ?
                d.employeenames.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                })
                :
                d.employeenameto.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                });
        });

        let findtaskstatus = result1.map(d => ({ id: d._id, username: d.employeenameto }))


        let query = {};

        if (findtaskstatus.length > 0) {
            query.$or = findtaskstatus.map(d => ({

                orginalid: String(d.id),
                username: d.username
            }));
        }
        taskmaintenanceforuserstatus = await TaskMaintenanceForUser.find(query, {
            orginalid: 1, username: 1, taskstatus: 1
        });


        result = result1.map(item => {

            let findstatus = taskmaintenanceforuserstatus.find(d =>
                d.orginalid == String(item._id) && d.username == item.employeenameto)?.taskstatus

            return {
                ...item,
                status: findstatus ? findstatus : "Pending"
            }
        })

    } catch (err) {
    console.log(err,"errmaintenance")
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result,
    });
});

exports.getAllSortedTaskMaintenanceForUserHomeTeamList = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser, taskmaintenanceforuserstatus, filteruser, result, maintenancenonschedule;


    try {

        const dayvalue = req.body.selectedFilter;
        function getDatesForDayValue(dayvalue) {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            if (dayvalue === "Today") {
                // For "Today"
                const day = [daysOfWeek[dayOfWeek]];
                const date = [today.getDate()];
                const fulldate = [today.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            } else if (dayvalue === "Tomorrow") {
                // For "Tomorrow"
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const day = [daysOfWeek[tomorrow.getDay()]];
                const date = [tomorrow.getDate()];
                const fulldate = [tomorrow.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            }
            else if (dayvalue === "Yesterday") {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const day = [daysOfWeek[yesterday.getDay()]];
                const date = [yesterday.getDate()];
                const fulldate = [yesterday.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            }
            else if (dayvalue === "This Week") {
                // For "This Week" (Monday to Sunday)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Adjust to Monday

                let day = [];
                let date = [];
                let fulldate = [];

                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfWeek);
                    currentDate.setDate(startOfWeek.getDate() + i);

                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]); // "YYYY-MM-DD"
                }
                const daysOfWeek2 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",];

                let fulldatewithdays = fulldate.map((d, ind) => ({

                    day: daysOfWeek2[ind],
                    date: d
                }))
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Last Week") {
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - dayOfWeek - 6); // Previous Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Previous Sunday

                let day = [];
                let date = [];
                let fulldate = [];

                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfLastWeek);
                    currentDate.setDate(startOfLastWeek.getDate() + i);

                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                }

                let fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[ind],
                    date: d
                }));

                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "This Month") {
                // For "This Month"

                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // October 1st
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // October 31st

                const startOfWeek = new Date(startOfMonth);
                startOfWeek.setDate(startOfMonth.getDate() + 1); // Adjust to the Monday of the current week
                const endOfWeek = new Date(endOfMonth);
                endOfWeek.setDate(endOfMonth.getDate() + 1);
                let day = [];
                let date = [];
                let fulldate = [];

                // Loop from the start of the week (which could be in the previous month) until the end of the current month
                let currentDate = new Date(startOfWeek);
                let endOfMonthDate = new Date(endOfWeek);


                while (currentDate <= endOfMonthDate) {
                    day.push(daysOfWeek[currentDate.getDay()]); // Day of the week (e.g., Monday, Tuesday)
                    date.push(currentDate.getDate()); // Date of the day (e.g., 30, 1, 2, etc.)
                    fulldate.push(currentDate.toISOString().split("T")[0]); // "YYYY-MM-DD"

                    // Move to the next day
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                const daysOfWeek2 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                // Generate fulldatewithdays combining the date with the day of the week
                let fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek2[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Last Month") {
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // 1st of last month
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month

                let day = [];
                let date = [];
                let fulldate = [];

                let currentDate = new Date(startOfLastMonth);
                while (currentDate <= endOfLastMonth) {
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                let fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));

                return { day, date, fulldate, fulldatewithdays };
            }
        }

        // Example usage:
        const { day, date, fulldate, fulldatewithdays } = getDatesForDayValue(dayvalue);


        taskmaintenanceforuser = await Maintenance.find({employeenameto:{$in:req.body.hierarchyempnames}}, { employeenameto: 1, assetmaterial: 1, weekdays: 1, monthdate: 1, annumonth: 1, annuday: 1, frequency: 1, schedule: 1, timetodo: 1, });

        maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find({employeenames:{$in:req.body.hierarchyempnames}}, { assetmaterial: 1, schedule: 1, date: 1, type: 1, employeenames: 1 });

        let combinedData = [...taskmaintenanceforuser, ...maintenancenonschedule]

        filteruser = combinedData.map(d => {
            const monthdateAsNumber = parseInt(d.monthdate, 10);
            const isToday = (dayvalue === "Today" && ((d.type && fulldate.includes(d.date)) || d.frequency === "Daily"

                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));


            const isTomorrow = (dayvalue === "Tomorrow" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisWeek = (dayvalue === "This Week" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisMonth = (dayvalue === "This Month" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));

            const isYesterday = (dayvalue === "Yesterday" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));

            const isLastWeek = (dayvalue === "Last Week" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));

            const isLastMonth = (dayvalue === "Last Month" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));
            // Add logging for debugging

            if (isToday) {
                return { ...d._doc, date: fulldate[0] };
            }
            else if (isTomorrow) {
                return { ...d._doc, date: fulldate[0] };
            }
            else if (isYesterday) {
                return { ...d._doc, date: fulldate[0] };
            }
            else if (isThisWeek) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }
            else if (isThisMonth) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }

            else if (isLastWeek) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }
            else if (isLastMonth) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }



            else {
                return null;
            }
        }).filter(Boolean);  // Filter out null values

        let result1 = [];

        filteruser = filteruser.map(t => ({
  ...t,
  employeenames: (t.employeenames || []).filter(item => req.body.hierarchyempnames.includes(item))
}));

        filteruser.forEach(d => {
            d.type ?
                d.employeenames.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                })
                :
                d.employeenameto.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                });
        });
        let findtaskstatus = result1.map(d => ({ id: d._id, username: d.employeenameto }))


        let query = {};

        if (findtaskstatus.length > 0) {
            query.$or = findtaskstatus.map(d => ({

                orginalid: String(d.id),
                username: d.username
            }));
        }
        taskmaintenanceforuserstatus = await TaskMaintenanceForUser.find(query, {
            orginalid: 1, username: 1, taskstatus: 1
        });


        result = result1.map(item => {

            let findstatus = taskmaintenanceforuserstatus.find(d =>
                d.orginalid == String(item._id) && d.username == item.employeenameto)?.taskstatus

            return {
                ...item,
                status: findstatus ? findstatus : "Pending"
            }
        })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        // count: products.length,
        result,
    });
});


//my login allot

exports.clientUseridsLimitedUserTeam = catchAsyncErrors(async (req, res, next) => {
  let clientuserid = [];
  try {
   
    loginids = await ClientUserID.find({ "loginallotlog.empname": { $in: req.body.hierarchyempnames } }, { userid: 1, loginallotlog: 1, projectvendor: 1 }).lean();
    let logs = loginids.flatMap((user) =>
      user.loginallotlog.map((log) => ({
        userid: user.userid,
        _id: user._id,
        projectvendor: user.projectvendor,
        date: log.date,
        time: log.time,
        empname: log.empname,
        empcode: log.empcode,
        enddate: log.enddate ? log.enddate : null,
      }))
    );

    // Step 2: Sort logs by date and time (ascending order)
    logs.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return new Date(a.date) - new Date(b.date);
    });

    // Step 3: Calculate the enddate for each log (except the last log for each userid)
    const userLogsMap = {};
    logs.forEach((log) => {
      if (!userLogsMap[log.userid]) {
        userLogsMap[log.userid] = {};
      }

      if (!userLogsMap[log.userid][log.projectvendor]) {
        userLogsMap[log.userid][log.projectvendor] = [];
      }

      userLogsMap[log.userid][log.projectvendor].push(log);
    });

    Object.values(userLogsMap).forEach((userLogs) => {
      Object.values(userLogs).forEach((logsArray) => {
        logsArray.forEach((log, idx) => {
          if (idx < logsArray.length - 1) {
            log.enddate = logsArray[idx + 1].date;
          }
        });
      });
    });
    // Step 4: Filter logs based on input date
    const filteredLogs = logs.filter((log) => {
      return new Date(log.date) <= new Date(req.body.date) && (!log.enddate || new Date(log.enddate) >= new Date(req.body.date));
    });

    // Step 5: Sort the filtered logs by date and time (descending order)
    filteredLogs.sort((a, b) => {
      if (a.date === b.date) {
        return b.time.localeCompare(a.time);
      }
      return new Date(b.date) - new Date(a.date);
    });
    clientuserid = filteredLogs.filter((d) => req.body.hierarchyempnames.includes(d.empname));

    console.log(clientuserid.length, "clientuserid");
  } catch (err) {
    console.log(err.message);
  }
  // if (!clientuserid) {
  //   return next(new ErrorHandler("Client User ID not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    clientuserid,
  });
});


//tickets and checklist

//my tickets
exports.getAllRaiseTicketFilteredIndividualDatasHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let result;
  let { hierarchyempnames } = req.body;

  try {
    result = await Raiseticketmaster.countDocuments({ employeename: {$in:hierarchyempnames} });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,
  });
});

//my pending tickets
exports.getAllRaiseTicketWithoutClosedHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  let { hierarchyempnames } = req.body;
  try {
    raisetickets = await Raiseticketmaster.find({employeename: {$in:hierarchyempnames}, raiseself: { $nin: ["Closed", "Reject", "Resolved"] } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raisetickets) {
    return next(new ErrorHandler("Raise Ticket not found!", 404));
  }
  return res.status(200).json({
    raisetickets,
  });
});

//details needed tickets
exports.getAllRaiseTicketForwardedEmployeeTeam = catchAsyncErrors(async (req, res, next) => {
  let raisetickets;
  let { hierarchyempnames } = req.body;
  try {
    raisetickets = await Raiseticketmaster.aggregate([
      {
        $match: {
          raiseself: "Forwarded",
          forwardedemployee: {
            $elemMatch: {
             $in:hierarchyempnames
            }
          }
        }
      }
    ])

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({ raisetickets });
});


exports.getAllUsersAssignbranchHomeTeam = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  let { hierarchyempnames } = req.body;
  if (!Array.isArray(assignbranch) || assignbranch.length === 0) {
    // return next(new ErrorHandler("assignbranch must be a non-empty array", 400));
  }
  // Create a query array for company and branch
  const query = {
    $or: assignbranch.map((item) => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit,
    })),
    enquirystatus: { $nin: ['Enquiry Purpose'] },
    resonablestatus: { $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'] },
 companyname: {$in:hierarchyempnames}
  };

  let users;

  try {
    users = await User.find(
      query,

      {
        status: 1,
        resonablestatus: 1,
        reasonname: 1,
        lastworkday: 1,
        rejoin: 1,
        reasonablestatusremarks: 1,
        department: 1,
        dob: 1,
        gender: 1,
        maritalstatus: 1,
        bloodgroup: 1,
        location: 1,
        contactpersonal: 1,
        panno: 1,
        aadhar: 1,
        designationlog: 1,
        contactfamily: 1,
        approvedremotestatus: 1,
        ctaluk: 1,
        dom: 1,
        processlog: 1,
        boardingLog: 1,
        attendancemode: 1,
        attendancemodelog: 1,
        company: 1,
        reasondate: 1,
        empreason: 1,
        percentage: 1,
        empcode: 1,
        companyname: 1,
        team: 1,
        username: 1,
        usernameautogenerate: 1,
        workmode: 1,
        email: 1,
        employeecount: 1,
        systemmode: 1,
        companyemail: 1,

        unit: 1,
        branch: 1,
        designation: 1,
        floor: 1,
        shift: 1,
        reportingto: 1,
        experience: 1,
        doj: 1,
        dot: 1,
        bankname: 1,
        bankbranchname: 1,
        accountholdername: 1,
        accountnumber: 1,
        ifsccode: 1,
        shifttiming: 1,
        shiftgrouping: 1,
        legalname: 1,
        callingname: 1,
        pdoorno: 1,
        paddresstype: 1,
        ppersonalprefix: 1,
        presourcename: 1,
        plandmarkandpositionalprefix: 1,
        pgpscoordination: 1,
        caddresstype: 1,
        cpersonalprefix: 1,
        cresourcename: 1,
        clandmarkandpositionalprefix: 1,
        cgpscoordination: 1,
        pstreet: 1,
        candidateid: 1,
        parea: 1,
        plandmark: 1,
        ptaluk: 1,
        ppost: 1,
        ppincode: 1,
        pcountry: 1,
        pstate: 1,
        pcity: 1,
        cdoorno: 1,
        cstreet: 1,
        carea: 1,
        role: 1,
        clandmark: 1,
        ctaluk: 1,
        cpost: 1,
        cpincode: 1,
        ccountry: 1,
        cstate: 1,
        ccity: 1,
        reasondate: 1,
        process: 1,
        workstation: 1,
        weekoff: 1,
        originalpassword: 1,
        enquirystatus: 1,
        area: 1,
        enableworkstation: 1,
        wordcheck: 1,
        shiftallot: 1,
        firstname: 1,
        lastname: 1,
        employeecount: 1,
        emergencyno: 1,
        name: 1,
        salarysetup: 1,
        mode: 1,
        salarycode: 1,
        basic: 1,
        hra: 1,
        conveyance: 1,
        medicalallowance: 1,
        productionallowance: 1,
        otherallowance: 1,
        productionallowancetwo: 1,
        pffromdate: 1,
        pfenddate: 1,
        esifromdate: 1,
        esienddate: 1,
        pfesistatus: 1,
        resonablestatus: 1,
        reasonname: 1,
        lastworkday: 1,
        department: 1,
        dob: 1,
        location: 1,
        bloodgroup: 1,
        gender: 1,
        maritalstatus: 1,
        lastname: 1,
        contactpersonal: 1,
        processlog: 1,
        boardingLog: 1,
        attendancemode: 1,
        attendancemodelog: 1,
        designationlog: 1,
        company: 1,
        reasondate: 1,
        empreason: 1,
        percentage: 1,
        empcode: 1,
        companyname: 1,
        team: 1,
        floor: 1,
        username: 1,
        usernameautogenerate: 1,
        workmode: 1,
        email: 1,
        employeecount: 1,
        systemmode: 1,
        companyemail: 1,

        unit: 1,
        branch: 1,
        designation: 1,
        team: 1,
        bankdetails: 1,
        shift: 1,
        reportingto: 1,
        experience: 1,
        doj: 1,
        role: 1,
        bankname: 1,
        bankbranchname: 1,
        accountholdername: 1,
        accountnumber: 1,
        ifsccode: 1,
        shifttiming: 1,
        shiftgrouping: 1,
        legalname: 1,
        callingname: 1,
        pdoorno: 1,
        paddresstype: 1,
        ppersonalprefix: 1,
        presourcename: 1,
        plandmarkandpositionalprefix: 1,
        pgpscoordination: 1,
        caddresstype: 1,
        cpersonalprefix: 1,
        cresourcename: 1,
        clandmarkandpositionalprefix: 1,
        cgpscoordination: 1,
        pstreet: 1,
        parea: 1,
        plandmark: 1,
        ptaluk: 1,
        ppost: 1,
        ppincode: 1,
        pcountry: 1,
        pstate: 1,
        pcity: 1,
        cdoorno: 1,
        cstreet: 1,
        carea: 1,
        clandmark: 1,
        ctaluk: 1,
        cpost: 1,
        cpincode: 1,
        ccountry: 1,
        cstate: 1,
        ccity: 1,
        reasondate: 1,
        process: 1,
        workstation: 1,
        weekoff: 1,
        originalpassword: 1,
        enquirystatus: 1,
        area: 1,
        enableworkstation: 1,
        wordcheck: 1,
        shiftallot: 1,
        twofaenabled: 1,
        fathername: 1,
        mothername: 1,
        firstname: 1,
        workstationinput: 1,
        emergencyno: 1,
        referencetodo: 1,
        contactno: 1,
        details: 1,
        assignExpLog: 1,
        grosssalary: 1,
        timemins: 1,
        modeexperience: 1,
        targetexperience: 1,
        targetpts: 1,
        expval: 1,
        expmode: 1,
        process: 1,
        processtype: 1,
        processduration: 1,
        duration: 1,
        workstationofficestatus: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }

  if (!users) {
    return next(new ErrorHandler('Users not found', 400));
  }

  return res.status(200).json({ count: users.length, users });
});


exports.getAllTemplateVerificationAssignBranchTeam = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch,hierarchyempnames } = req.body;

 

  let templateList;
  try {
     const query = {
    $or: assignbranch.map((item) => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit,
    })),
     employeename: { $in: hierarchyempnames }
  };
    templateList = await Templatelist.find(query);
  } catch (err) {
    return next(new ErrorHandler('Data not found!', 404));
  }

  if (!templateList || templateList.length === 0) {
    return next(new ErrorHandler('Templatelist not found!', 404));
  }

  return res.status(200).json({
    templateList,
  });
});


exports.getAllTemplateVerificationAssignBranchForfilterTeam = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch, companyname } = req.body;
  let { hierarchyempnames } = req.body;
  const query = {
    // $or: assignbranch.map(item => ({
    //     company: item.company,
    //     branch: item.branch,
    //     unit: item.unit
    // }))
    companyname:{ $in: hierarchyempnames },
  };

  let templateListVerification;
  try {
    const [templateList, users] = await Promise.all([
      Templatelist.find({
        employeename: { $in: hierarchyempnames },
      }).lean(),
      User.find(
        query,

        {
          status: 1,
          resonablestatus: 1,
          reasonname: 1,
          lastworkday: 1,
          rejoin: 1,
          reasonablestatusremarks: 1,
          department: 1,
          dob: 1,
          gender: 1,
          maritalstatus: 1,
          bloodgroup: 1,
          location: 1,
          contactpersonal: 1,
          panno: 1,
          aadhar: 1,
          designationlog: 1,
          contactfamily: 1,
          approvedremotestatus: 1,
          ctaluk: 1,
          dom: 1,
          processlog: 1,
          boardingLog: 1,
          attendancemode: 1,
          company: 1,
          reasondate: 1,
          empreason: 1,
          percentage: 1,
          empcode: 1,
          companyname: 1,
          team: 1,
          username: 1,
          usernameautogenerate: 1,
          workmode: 1,
          email: 1,
          employeecount: 1,
          systemmode: 1,
          companyemail: 1,

          unit: 1,
          branch: 1,
          designation: 1,
          floor: 1,
          shift: 1,
          reportingto: 1,
          experience: 1,
          doj: 1,
          dot: 1,
          bankname: 1,
          bankbranchname: 1,
          accountholdername: 1,
          accountnumber: 1,
          ifsccode: 1,
          shifttiming: 1,
          shiftgrouping: 1,
          legalname: 1,
          callingname: 1,
          pdoorno: 1,
          pstreet: 1,
          candidateid: 1,
          parea: 1,
          plandmark: 1,
          ptaluk: 1,
          ppost: 1,
          ppincode: 1,
          pcountry: 1,
          pstate: 1,
          pcity: 1,
          cdoorno: 1,
          cstreet: 1,
          carea: 1,
          role: 1,
          clandmark: 1,
          ctaluk: 1,
          cpost: 1,
          cpincode: 1,
          ccountry: 1,
          cstate: 1,
          ccity: 1,
          reasondate: 1,
          process: 1,
          workstation: 1,
          weekoff: 1,
          originalpassword: 1,
          enquirystatus: 1,
          area: 1,
          enableworkstation: 1,
          wordcheck: 1,
          shiftallot: 1,
          firstname: 1,
          lastname: 1,
          employeecount: 1,
          emergencyno: 1,
          name: 1,
          salarysetup: 1,
          mode: 1,
          salarycode: 1,
          basic: 1,
          hra: 1,
          conveyance: 1,
          medicalallowance: 1,
          productionallowance: 1,
          otherallowance: 1,
          productionallowancetwo: 1,
          pffromdate: 1,
          pfenddate: 1,
          esifromdate: 1,
          esienddate: 1,
          pfesistatus: 1,
          resonablestatus: 1,
          reasonname: 1,
          lastworkday: 1,
          department: 1,
          dob: 1,
          location: 1,
          bloodgroup: 1,
          gender: 1,
          maritalstatus: 1,
          lastname: 1,
          contactpersonal: 1,
          processlog: 1,
          boardingLog: 1,
          attendancemode: 1,
          designationlog: 1,
          company: 1,
          reasondate: 1,
          empreason: 1,
          percentage: 1,
          empcode: 1,
          companyname: 1,
          team: 1,
          floor: 1,
          username: 1,
          usernameautogenerate: 1,
          workmode: 1,
          email: 1,
          employeecount: 1,
          systemmode: 1,
          companyemail: 1,

          unit: 1,
          branch: 1,
          designation: 1,
          team: 1,
          bankdetails: 1,
          shift: 1,
          reportingto: 1,
          experience: 1,
          doj: 1,
          role: 1,
          bankname: 1,
          bankbranchname: 1,
          accountholdername: 1,
          accountnumber: 1,
          ifsccode: 1,
          shifttiming: 1,
          shiftgrouping: 1,
          legalname: 1,
          callingname: 1,
          pdoorno: 1,
          pstreet: 1,
          parea: 1,
          plandmark: 1,
          ptaluk: 1,
          ppost: 1,
          ppincode: 1,
          pcountry: 1,
          pstate: 1,
          pcity: 1,
          cdoorno: 1,
          cstreet: 1,
          carea: 1,
          clandmark: 1,
          ctaluk: 1,
          cpost: 1,
          cpincode: 1,
          ccountry: 1,
          cstate: 1,
          ccity: 1,
          reasondate: 1,
          process: 1,
          workstation: 1,
          weekoff: 1,
          originalpassword: 1,
          enquirystatus: 1,
          area: 1,
          enableworkstation: 1,
          wordcheck: 1,
          shiftallot: 1,
          twofaenabled: 1,
          fathername: 1,
          mothername: 1,
          firstname: 1,
          workstationinput: 1,
          emergencyno: 1,
          referencetodo: 1,
          contactno: 1,
          details: 1,
          assignExpLog: 1,
          grosssalary: 1,
          timemins: 1,
          modeexperience: 1,
          targetexperience: 1,
          targetpts: 1,
          expval: 1,
          expmode: 1,
          process: 1,
          processtype: 1,
          processduration: 1,
          duration: 1,
          workstationofficestatus: 1,
          _id: 1,
        }
      ).lean(),
    ]);

    // console.log(templateList, "templateList")
    // console.log(users, "users")

    let filterArray = [];
    templateList?.forEach((templateUser) => {
      templateUser?.employeename?.forEach((empName) => {
        users?.forEach((user) => {
          if (user.companyname === empName) {
            let extendedUser = {
              id: user?._id,
              templateId: templateUser?._id,
              verified: templateUser?.verifiedInfo,
              corrected: templateUser?.correctedInfo,
              company: user?.company,
              branch: user?.branch,
              unit: user?.unit,
              team: user?.team,
              employeename: user?.companyname,
              filename: templateUser?.filename,
              information: templateUser?.informationstring,
              verifyInfo: templateUser?.verifiedInfo,
            };
            filterArray.push(extendedUser);
          }
        });
      });
    });
    const generateNewIds = async (array) => {
      return array.map((item) => {
        return {
          ...item,
          commonid: uuidv4(), // Generate a new UUID for each object
        };
      });
    };
    let needToVerify = filterArray.filter((data) => hierarchyempnames.includes(data.employeename));

    const transformArray = (array) => {
      let result = [];
      array?.forEach((obj) => {
        obj.verifyInfo?.forEach((info) => {
          if (!info.edited && !info.corrected) {
            // Create a new object for each information value
            const newObject = {
              ...obj,
              information: info.name, // Assign a single value from the information array
            };
            result.push(newObject);
          }
        });
      });
      return result;
    };
    // Transform the array
    const transformedArray = transformArray(needToVerify);

    const arrayWithNewIds = await generateNewIds(transformedArray);
    let valid = arrayWithNewIds.filter((item) => {
      return item.information !== 'Boarding Information' && item.information !== 'Process Allot' && item.information !== 'Login Details';
    });
    const removeDuplicateNames = (array) => {
      const names = array.map((item) => item.information); // Extract names
      const uniqueNames = [...new Set(names)]; // Filter unique names

      return array.filter((item, index) => {
        return uniqueNames.includes(item.information) && uniqueNames.splice(uniqueNames.indexOf(item.information), 1);
      });
    };

    // Use the function
    templateListVerification = removeDuplicateNames(valid);

    if (!templateListVerification || templateListVerification.length === 0) {
      //return next(new ErrorHandler('My Verification not found!', 404));
      return res.status(200).json({
        myverification: [],
      });
    }
    return res.status(200).json({
      success: true,
      count: templateListVerification.length,
      myverification: templateListVerification,
    });
  } catch (err) {
    console.log(err,"erer")
    return next(new ErrorHandler('Data not found!', 404));
  }
});
