
const ProductionDayList = require('../../../model/modules/production/productiondaylist');
const ProductionDay = require('../../../model/modules/production/productionday');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const User = require("../../../model/login/auth");
const Shift = require('../../../model/modules/shift');
const Leavetype = require('../../../model/modules/leave/leavetype');
const Permission = require('../../../model/modules/permission/permission');
const ApplyLeave = require('../../../model/modules/leave/applyleave');
const Holiday = require('../../../model/modules/setup/holidayModel');
const Attendance = require("../../../model/modules/attendance/attendance");
const ControlCriteria = require("../../../model/modules/settings/Attendancecontrolcriteria");
const moment = require("moment");
const currentDateAttStatus = new Date();
const ProductionUpload = require("../../../model/modules/production/productionupload");
const ProducionIndividual = require("../../../model/modules/production/productionindividual")



const formatDateRemove = (inputDate) => {
  if (!inputDate) {
    return ""
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [day, month, year] = inputDate?.split('-');

  return `${day}/${month}/${year}`;
};


const parseTime = (timeString) => {
  if (!timeString) {
    return '';
  }

  // Check if the timeString contains a space
  const hasSpace = timeString?.includes(' ');

  // Split based on whether there's a space or not
  const [time, period] = hasSpace ? timeString?.split(' ') : [timeString?.slice(0, -2), timeString?.slice(-2)];

  const [hours, minutes, seconds] = time?.split(':');

  let parsedHours = parseInt(hours, 10);

  if ((period === 'PM' && parsedHours !== 12) && (period === 'pm' && parsedHours !== 12)) {
    parsedHours += 12;
  } else if ((period === 'AM' && parsedHours === 12) && (period === 'am' && parsedHours === 12)) {
    parsedHours = 0;
  }

  // if ((period === 'PM' && parsedHours !== 12) || (period === 'pm' && parsedHours !== 12)) {
  //     parsedHours += 12;
  // }
  // else if ((period === 'AM' && parsedHours === 12) || (period === 'am' && parsedHours === 12)) {
  //     parsedHours = 0;
  // }

  if ((period === 'PM' || period === 'pm') && parsedHours !== 12) {
    parsedHours += 12;
  }
  else if ((period === 'AM' || period === 'am') && parsedHours === 12) {
    parsedHours = 0;
  }

  return new Date(2000, 0, 1, parsedHours, parseInt(minutes, 10), parseInt(seconds || 0, 10));
};


// get All ProductionDayList => /api/productiondaylistss
exports.getAllProductionDayList = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists;
  try {
    productiondaylists = await ProductionDayList.find();
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondaylists,
  });
});

// get All ProductionDayListBy Date => /api/productiondaylistss
// get All ProductionDayListBy Date => /api/productiondaylistss
exports.getAllProductionDayListByDate = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists = [];
  let result = [];
  try {
    const query1 = {
      date: new RegExp("^" + req.body.date), // using RegExp for partial match
    };
    findUniqIdDay = await ProductionDay.findOne(query1);
    const query = {
      uniqueid: findUniqIdDay.uniqueid, // using RegExp for partial match
    };
    productiondaylists = await ProductionDayList.find(query);

    // console.log(productiondaylists[0], "productiondaylists");

    result = productiondaylists.reduce((acc, current) => {
      const [dateCurr] = current.dateval?.split(" ");
      const existingItemIndex = acc.findIndex((item) => {
        return item.empname === current.empname && item.empcode === current.empcode && item.company === current.company
          && item.branch === current.branch;
      });

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];

        existingItem.count += 1;
        existingItem.production += current.mode === "Production" ? Number(current.conpoints) : 0;
        existingItem.manual += current.mode === "Manual" ? Number(current.conpoints) : 0;

        existingItem.empname = current.empname;
        existingItem.processcode = current.processcode;
        existingItem.fromtodate = current.fromtodate;
        existingItem.target = current.target;
        existingItem.shiftsts = current.shiftsts;
        existingItem.points += Number(current.conpoints);
        existingItem.conshiftpoints += Number(current.conshiftpoints);
        existingItem.shiftpoints += Number(current.shiftpoints);

        // existingItem.users.push(new Set(current.user));
        // Ensure existingItem.users is always an array
        if (!Array.isArray(existingItem.users)) {
          existingItem.users = [];
        }

        // Add current user to the set to remove duplicates
        const uniqueUsersSet = new Set(existingItem.users);
        uniqueUsersSet.add(current.user);
        existingItem.users = Array.from(uniqueUsersSet);
      } else {
        // Add new item

        acc.push({
          empname: current.empname,
          empcode: current.empcode,
          company: current.company,
          fromtodate: current.fromtodate,
          unit: current.unit,
          team: current.team,
          dateval: current.dateval,
          processcode: current.processcode,
          date: dateCurr,
          exper: current.experience,
          target: current.target,
          branch: current.branch,
          shiftsts: current.shiftsts,
          production: current.mode === "Production" ? Number(current.conpoints) : 0,
          manual: current.mode === "Manual" ? Number(current.conpoints) : 0,
          points: Number(current.conpoints),
          shiftpoints: Number(current.shiftpoints),
          conshiftpoints: Number(current.conshiftpoints),
          users: [current.user],

          count: Number(1),
        });
      }
      return acc;
    }, []);

    console.log(result.length);
    // SUDARVIZHI.ASAITHAMBI
  } catch (err) {
    console.log(err.message);
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result,
  });
});

// get Signle ProductionDayList => /api/productiondaylists/:id
exports.productionDayListGetDeleteLimited = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists;
  try {
    productiondaylists = await ProductionDayList.find({ uniqueid: req.body.uniqid }, { _id: 1 });
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondaylists,
  });
});

// get Signle ProductionDayList => /api/productiondaylists/:id
exports.productionDayListGetViewLimited = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists;
  try {
    productiondaylists = await ProductionDayList.find({ uniqueid: req.body.uniqid }, {
      company: 1, branch: 1, unit: 1, team: 1, doj: 1, processcode: 1, experience: 1, target: 1, avgpoint: 1, project: 1, department: 1,
      category: 1, filename: 1, empname: 1, fromtodate: 1, empcode: 1, user: 1, unitid: 1, unitrate: 1, dateval: 1, vendor: 1, points: 1, aprocess: 1, sprocess: 1, contarget: 1, conpoints: 1,
      conavg: 1, mode: 1
    });
  } catch (err) {
    console.log(err.message);
  }
  if (!productiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productiondaylists,
  });
});

// Create new ProductionDayList=> /api/productiondaylists/new
exports.addProductionDayList = catchAsyncErrors(async (req, res, next) => {

  let aproductiondaylists = await ProductionDayList.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionDayList => /api/productiondaylists/:id
exports.getSingleProductionDayList = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductiondaylists = await ProductionDayList.findById(id);

  if (!sproductiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sproductiondaylists,
  });
});

// update ProductionDayList by id => /api/productiondaylists/:id
exports.updateProductionDayList = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uproductiondaylists = await ProductionDayList.findByIdAndUpdate(id, req.body);
  if (!uproductiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionDayList by id => /api/productiondaylists/:id
exports.deleteProductionDayList = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductiondaylists = await ProductionDayList.findByIdAndRemove(id);

  if (!dproductiondaylists) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// delete ProductionDay by unid matching unitidval => /api/productiondays/:unitidval
exports.deleteProductionDayByUnid = catchAsyncErrors(async (req, res, next) => {
  const unitidval = req.body.uniqid; // Assuming unitidval is passed in the URL params

  // Delete documents with matching unid
  let result = await ProductionDayList.deleteMany({ uniqueid: unitidval });
  // console.log(result)
  // Check if any documents were deleted
  if (result.deletedCount === 0) {
    return next(new ErrorHandler("Data not found!", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


// get All ClientUserID Name => /api/clientuserids
exports.getEmpProductionDayLastThreeMonths = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists = [];
  try {

    const { empname, department } = req.body;

    let dateNow = new Date();
    let datevalue = dateNow.toISOString().split("T")[0];

    const findCurrdeptMonthSets = await DepartmentMonth.find({
      fromdate: { $lte: datevalue },
      todate: { $gte: datevalue },
      year: dateNow.getFullYear(),
      department: department,
    }, { monthname: 1, year: 1, fromdate: 1, todate: 1 });


    let currMonthFromdate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].fromdate : "";
    let currMonthTodate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].todate : "";

    let productionDayid = await ProductionDay.find({ date: { $gte: currMonthFromdate, $lte: currMonthTodate } }, { uniqueid: 1 });

    let productionUniqIds = productionDayid.map(item => item.uniqueid);


    productiondaylists = await ProductionDayList.find({ uniqueid: { $in: productionUniqIds }, empname: empname }, {});


    console.log(productiondaylists.length, 'productiondaylists')

    return res.status(200).json({

      productiondaylists
    });
  } catch (err) {
    console.log(err.message, 'SDFSD12');
  }


});


// Shift Roaster functions
//attendance checklist
const checkAttendanceStatus = (attendance, rowuserid, rowdate, rowshiftmode) => {
  const attendanceRecord = attendance?.find(
    (d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode
  );

  // Check if attendanceRecord exists and its attendancestatus is not undefined
  if (attendanceRecord && attendanceRecord.attendancestatus !== undefined) {
    return attendanceRecord.attendancestatus;
  }
  // Return a default value if attendanceRecord or attendancestatus is not available
  return "";
};

//attendance weekoff present
const checkWeekOffPresentStatus = (attendance, rowuserid, rowdate, rowshiftmode) => {
  const attendanceRecord = attendance?.find(
    (d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode && d.weekoffpresentstatus === true
  );

  // Check if attendanceRecord exists and its attendancestatus is not undefined
  if (attendanceRecord && attendanceRecord.weekoffpresentstatus !== undefined) {
    return attendanceRecord.weekoffpresentstatus;
  }
  // Return a default value if attendanceRecord or attendancestatus is not available
  return "";
};
// Get Clock in time for the user
const checkGetClockInTime = (attendance, rowuserid, rowdate, rowshift, rowshiftmode) => {

  const attendanceRecord = attendance?.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  if (attendanceRecord) {

    return attendanceRecord.clockintime !== "" ? rowshift === 'Week Off' ? "00:00:00" : attendanceRecord.clockintime : "00:00:00";
  }
  // Return a default value if clockin time is not available
  return "00:00:00";

};

// Get Clock out time for the user
const checkGetClockOutTime = (attendance, rowuserid, rowdate, rowshift, rowshiftmode) => {

  const attendanceRecord = attendance.find((d) => d.userid === rowuserid && formatDateRemove(d.date) === rowdate && d.shiftmode === rowshiftmode);

  if (attendanceRecord) {
    return attendanceRecord.clockouttime !== "" ? rowshift === 'Week Off' ? "00:00:00" : attendanceRecord.clockouttime : "00:00:00";
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
  const attendanceRecord = attendance.find(
    (record) => record.userid === rowuserid && formatDateRemove(record.date) === rowdate && record.shiftmode === rowshiftmode
  );

  if (attendanceRecord) {
    return attendanceRecord.clockinipaddress;
  }

  // Return an empty string if no attendance record is found
  return "";
};

const checkClockInStatus = (clockintime, rowshift, graceTime, allLeaveStatus, holidays, clockindate, rowbranch, rowempcode, rowcompany, rowformattedDate, rowunit, rowteam, rowcompanyname,
  earlyClockInTime, lateClockInTime, afterLateClockInTime, leavetype, permission, clockouttime, rowshiftmode, weekoffpresentstatus) => {

  const totalFinalLeaveDaysApproved = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");
  const totalFinalLeaveDaysApplied = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Applied");
  const totalFinalLeaveDaysRejected = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Rejected");

  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === '');
  const permissionAppliedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === '');
  const permissionRejectedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Rejected" && d.compensationstatus === '');

  // const totalPermissionApprovedStart = permission.find((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === 'Compensation');
  // const totalPermissionAppliedStart = permission.find((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === 'Compensation');

  const totalPermissionApprovedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === 'Compensation');
  const totalPermissionAppliedStart = permission.filter((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === 'Compensation');

  const holidayResults = holidays.filter((item) => moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY") === rowformattedDate)
  const isHoliday = holidayResults?.some(holiday =>
    holiday.company?.includes(rowcompany) &&
      holiday.applicablefor?.includes(rowbranch) &&
      holiday.unit?.includes(rowunit) &&
      holiday.team?.includes(rowteam) &&
      holiday.employee.includes('ALL') ? rowcompanyname : holiday.employee?.includes(rowcompanyname)
  );

  let leavestatusApproved = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApproved && totalFinalLeaveDaysApproved.forEach((d) => {
      if (type.leavetype === d.leavetype) {
        d.usershifts.forEach((shift) => {
          leavestatusApproved.push({
            date: shift.formattedDate,
            leavetype: d.leavetype,
            status: d.status,
            code: type.code,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        })
      }
    });
  });

  let leavestatusApplied = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApplied && totalFinalLeaveDaysApplied.forEach((d) => {
      if (type.leavetype === d.leavetype) {
        d.usershifts.forEach((shift) => {
          leavestatusApplied.push({
            date: shift.formattedDate,
            leavetype: d.leavetype,
            status: d.status,
            code: type.code,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        })
      }
    });
  });

  let leavestatusRejected = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysRejected && totalFinalLeaveDaysRejected.forEach((d) => {
      if (type.leavetype === d.leavetype) {
        d.usershifts.forEach((shift) => {
          leavestatusRejected.push({
            date: shift.formattedDate,
            leavetype: d.leavetype,
            status: d.status,
            code: type.code,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        })
      }
    });
  });

  const leaveOnDateApprovedSingleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift');
  const leaveOnDateApprovedSingleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateApprovedSingleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'After Half Shift');

  const leaveOnDateApprovedDoubleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift');
  const leaveOnDateApprovedDoubleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateApprovedDoubleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'After Half Shift');

  const leaveOnDateAppliedSingleFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift');
  const leaveOnDateAppliedSingleHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateAppliedSingleHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'After Half Shift');

  const leaveOnDateAppliedDoubleFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift');
  const leaveOnDateAppliedDoubleHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateAppliedDoubleHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'After Half Shift');

  const leaveOnDateRejectedSingleFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift');
  const leaveOnDateRejectedSingleHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateRejectedSingleHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'After Half Shift');

  const leaveOnDateRejectedDoubleFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift');
  const leaveOnDateRejectedDoubleHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateRejectedDoubleHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'After Half Shift');

  if (permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "PERAPPR";
  }
  if (permissionAppliedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "PERAPPL";
  }
  if (permissionRejectedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "PERREJ";
  }
  if (totalPermissionApprovedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "COMP - PERAPPR";
  }
  if (totalPermissionAppliedStart.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "COMP - PERAPPR";
  }

  // let clockInTime = parseTime(clockintime, rowformattedDate);
  // let startTime = parseTime(rowshift?.split('to')[0], rowformattedDate);
  // let startTimeWithPM = rowshift?.split('to')[0];
  // let endTime = parseTime(rowshift?.split('to')[1], rowformattedDate);

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
  var formattedHours = String(hours).padStart(2, '0');
  var formattedMinutes = String(minutes).padStart(2, '0');

  // Combine hours and minutes into the desired format
  var currentTime = formattedHours + ":" + formattedMinutes;

  let clockInTime = parseTime(clockintime);
  let startTime = parseTime(rowshift?.split('to')[0]);
  let startTimeWithPM = rowshift?.split('to')[0];

  if (!startTime) {
    return (rowshift === 'Week Off' && clockintime === "00:00:00") ? 'Week Off' : 'Invalid start time';
  }

  if (startTimeWithPM.includes('PM')) {
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
    if (startTimeWithPM.includes('PM') && clockintime.includes('AM')) {
      clockInTime.setDate(clockInTime.getDate() + 1); // Move endTime to the next day
    }

    // Night Shift
    // Check if clockInTime is within the grace period
    if (isHoliday && rowshift !== "Week Off") {
      return 'Holiday';
    }
    else if (leaveOnDateApprovedSingleFL) {
      return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
    }
    else if (leaveOnDateApprovedSingleHB) {
      return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
    }
    else if (leaveOnDateApprovedSingleHA) {
      return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
    }
    else if (leaveOnDateApprovedDoubleFL) {
      return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
    }
    else if (leaveOnDateApprovedDoubleHB) {
      return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
    }
    else if (leaveOnDateApprovedDoubleHA) {
      return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
    }
    else if (leaveOnDateAppliedSingleFL) {
      return `${leaveOnDateAppliedSingleFL.code} ${leaveOnDateAppliedSingleFL.status}`;
    }
    else if (leaveOnDateAppliedSingleHB) {
      return `HB - ${leaveOnDateAppliedSingleHB.code} ${leaveOnDateAppliedSingleHB.status}`;
    }
    else if (leaveOnDateAppliedSingleHA) {
      return `HA - ${leaveOnDateAppliedSingleHA.code} ${leaveOnDateAppliedSingleHA.status}`;
    }
    else if (leaveOnDateAppliedDoubleFL) {
      return `DL - ${leaveOnDateAppliedDoubleFL.code} ${leaveOnDateAppliedDoubleFL.status}`;
    }
    else if (leaveOnDateAppliedDoubleHB) {
      return `DHB - ${leaveOnDateAppliedDoubleHB.code} ${leaveOnDateAppliedDoubleHB.status}`;
    }
    else if (leaveOnDateAppliedDoubleHA) {
      return `DHA - ${leaveOnDateAppliedDoubleHA.code} ${leaveOnDateAppliedDoubleHA.status}`;
    }
    else if (leaveOnDateRejectedSingleFL) {
      return `${leaveOnDateRejectedSingleFL.code} ${leaveOnDateRejectedSingleFL.status}`;
    }
    else if (leaveOnDateRejectedSingleHB) {
      return `HB - ${leaveOnDateRejectedSingleHB.code} ${leaveOnDateRejectedSingleHB.status}`;
    }
    else if (leaveOnDateRejectedSingleHA) {
      return `HA - ${leaveOnDateRejectedSingleHA.code} ${leaveOnDateRejectedSingleHA.status}`;
    }
    else if (leaveOnDateRejectedDoubleFL) {
      return `DL - ${leaveOnDateRejectedDoubleFL.code} ${leaveOnDateRejectedDoubleFL.status}`;
    }
    else if (leaveOnDateRejectedDoubleHB) {
      return `DHB - ${leaveOnDateRejectedDoubleHB.code} ${leaveOnDateRejectedDoubleHB.status}`;
    }
    else if (leaveOnDateRejectedDoubleHA) {
      return `DHA - ${leaveOnDateRejectedDoubleHA.code} ${leaveOnDateRejectedDoubleHA.status}`;
    }
    else if (rowshift === "Pending..." && clockintime !== "00:00:00") {
      return `Pending...`;
    }
    else if (rowshift === "Week Off" && clockintime === "00:00:00") {
      return `Week Off`;
    }
    else if (weekoffpresentstatus === true) {
      return 'Week Off Present';
    }
    else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(':').map(Number)) < startTime) {
      return `Shift Not Started`;
    }
    else if (clockintime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    }
    else if (clockInTime >= startTimeWithEarly && clockInTime <= startTime) {
      return `On - Present`;
    }
    else if (clockInTime >= startTimeWithGrace && clockInTime <= startTimeWithLate) {
      return `Late - ClockIn`;
    }
    else if (clockInTime >= startTimeWithLate && clockInTime <= startTimeWithHalfLop) {
      return `HBLOP`;
    }
    else if (clockInTime >= startTimeWithHalfLop) {
      return `FLOP`;
    }
    else if (clockInTime >= startTime && clockInTime <= startTimeWithGrace) {
      return `Grace - ClockIn`;
    }
    else if (clockInTime < startTimeWithEarly) {
      return `Early - ClockIn`;
    }
    else {
      return `Present`;
    }
  }
  else {
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
      return 'Holiday';
    }
    // else if (leaveOnDateCasualApproved.length > 0 && rowshift !== "Week Off") {
    //     return 'Leave ';
    // }
    else if (leaveOnDateApprovedSingleFL) {
      return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
    }
    else if (leaveOnDateApprovedSingleHB) {
      return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
    }
    else if (leaveOnDateApprovedSingleHA) {
      return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
    }
    else if (leaveOnDateApprovedDoubleFL) {
      return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
    }
    else if (leaveOnDateApprovedDoubleHB) {
      return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
    }
    else if (leaveOnDateApprovedDoubleHA) {
      return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
    }
    else if (leaveOnDateAppliedSingleFL) {
      return `${leaveOnDateAppliedSingleFL.code} ${leaveOnDateAppliedSingleFL.status}`;
    }
    else if (leaveOnDateAppliedSingleHB) {
      return `HB - ${leaveOnDateAppliedSingleHB.code} ${leaveOnDateAppliedSingleHB.status}`;
    }
    else if (leaveOnDateAppliedSingleHA) {
      return `HA - ${leaveOnDateAppliedSingleHA.code} ${leaveOnDateAppliedSingleHA.status}`;
    }
    else if (leaveOnDateAppliedDoubleFL) {
      return `DL - ${leaveOnDateAppliedDoubleFL.code} ${leaveOnDateAppliedDoubleFL.status}`;
    }
    else if (leaveOnDateAppliedDoubleHB) {
      return `DHB - ${leaveOnDateAppliedDoubleHB.code} ${leaveOnDateAppliedDoubleHB.status}`;
    }
    else if (leaveOnDateAppliedDoubleHA) {
      return `DHA - ${leaveOnDateAppliedDoubleHA.code} ${leaveOnDateAppliedDoubleHA.status}`;
    }
    else if (leaveOnDateRejectedSingleFL) {
      return `${leaveOnDateRejectedSingleFL.code} ${leaveOnDateRejectedSingleFL.status}`;
    }
    else if (leaveOnDateRejectedSingleHB) {
      return `HB - ${leaveOnDateRejectedSingleHB.code} ${leaveOnDateRejectedSingleHB.status}`;
    }
    else if (leaveOnDateRejectedSingleHA) {
      return `HA - ${leaveOnDateRejectedSingleHA.code} ${leaveOnDateRejectedSingleHA.status}`;
    }
    else if (leaveOnDateRejectedDoubleFL) {
      return `DL - ${leaveOnDateRejectedDoubleFL.code} ${leaveOnDateRejectedDoubleFL.status}`;
    }
    else if (leaveOnDateRejectedDoubleHB) {
      return `DHB - ${leaveOnDateRejectedDoubleHB.code} ${leaveOnDateRejectedDoubleHB.status}`;
    }
    else if (leaveOnDateRejectedDoubleHA) {
      return `DHA - ${leaveOnDateRejectedDoubleHA.code} ${leaveOnDateRejectedDoubleHA.status}`;
    }
    else if (rowshift === "Pending..." && clockintime !== "00:00:00") {
      return `Pending...`;
    }
    else if (rowshift === "Week Off" && clockintime === "00:00:00") {
      return `Week Off`;
    }
    else if (weekoffpresentstatus === true) {
      return 'Week Off Present';
    }
    else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(':').map(Number)) < startTime) {
      return `Shift Not Started`;
    }
    else if (clockintime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    }
    else if (clockInTime >= startTimeWithEarly && clockInTime <= startTime) {
      return `On - Present`;
    }
    else if (clockInTime >= startTimeWithGrace && clockInTime <= startTimeWithLate) {
      return `Late - ClockIn`;
    }
    else if (clockInTime >= startTimeWithLate && clockInTime <= startTimeWithHalfLop) {
      return `HBLOP`;
    }
    else if (clockInTime >= startTimeWithHalfLop) {
      return `FLOP`;
    }
    else if (clockInTime >= startTime && clockInTime <= startTimeWithGrace) {
      return `Grace - ClockIn`;
    }
    else if (clockInTime < startTimeWithEarly) {
      return `Early - ClockIn`;
    }
    else {
      return `Present`;
    }
  }

};

const checkClockOutStatus = (clockouttime, clockintime, rowshift, clockOutHours, clockindate, allLeaveStatus, holidays, rowbranch, rowempcode, rowcompany, rowformattedDate, rowunit, rowteam, rowcompanyname, onClockOutTime,
  earlyClockOutTime, beforeEarlyClockOutTime, autoClockOutStatus, leavetype, permission, rowshiftmode, weekoffpresentstatus) => {

  const totalFinalLeaveDaysApproved = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Approved");
  const totalFinalLeaveDaysApplied = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Applied");
  const totalFinalLeaveDaysRejected = allLeaveStatus?.filter((d) => d.employeeid === rowempcode && d.status === "Rejected");

  const permissionApprovedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === '');
  const permissionAppliedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === '');
  const permissionRejectedWithoutComp = permission.filter((d) => d.employeeid === rowempcode && d.status === "Rejected" && d.compensationstatus === '');

  const totalPermissionApprovedEnd = permission.filter((d) => d.employeeid === rowempcode && d.status === "Approved" && d.compensationstatus === 'Compensation');
  const totalPermissionAppliedEnd = permission.filter((d) => d.employeeid === rowempcode && d.status === "Applied" && d.compensationstatus === 'Compensation');

  const holidayResults = holidays.filter((item) => moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY") === rowformattedDate)

  const isHoliday = holidayResults.some(holiday =>
    holiday.company?.includes(rowcompany) &&
      holiday.applicablefor?.includes(rowbranch) &&
      holiday.unit?.includes(rowunit) &&
      holiday.team?.includes(rowteam) &&
      holiday.employee.includes('ALL') ? rowcompanyname : holiday.employee?.includes(rowcompanyname)
  );

  let leavestatusApproved = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApproved && totalFinalLeaveDaysApproved.forEach((d) => {
      if (type.leavetype === d.leavetype) {
        d.usershifts.forEach((shift) => {
          leavestatusApproved.push({
            date: shift.formattedDate,
            leavetype: d.leavetype,
            status: d.status,
            code: type.code,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        })
      }
    });
  });

  let leavestatusApplied = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysApplied && totalFinalLeaveDaysApplied.forEach((d) => {
      if (type.leavetype === d.leavetype) {
        d.usershifts.forEach((shift) => {
          leavestatusApplied.push({
            date: shift.formattedDate,
            leavetype: d.leavetype,
            status: d.status,
            code: type.code,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        })
      }
    });
  });

  let leavestatusRejected = [];

  leavetype?.map((type) => {
    totalFinalLeaveDaysRejected && totalFinalLeaveDaysRejected.forEach((d) => {
      if (type.leavetype === d.leavetype) {
        d.usershifts.forEach((shift) => {
          leavestatusRejected.push({
            date: shift.formattedDate,
            leavetype: d.leavetype,
            status: d.status,
            code: type.code,
            tookleavecheckstatus: shift.tookleavecheckstatus,
            leavestatus: shift.leavestatus,
            shiftcount: shift.shiftcount,
          });
        })
      }
    });
  });

  const leaveOnDateApprovedSingleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift');
  const leaveOnDateApprovedSingleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateApprovedSingleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'After Half Shift');

  const leaveOnDateApprovedDoubleFL = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift');
  const leaveOnDateApprovedDoubleHB = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateApprovedDoubleHA = leavestatusApproved.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'After Half Shift');

  const leaveOnDateAppliedSingleFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift');
  const leaveOnDateAppliedSingleHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateAppliedSingleHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'After Half Shift');

  const leaveOnDateAppliedDoubleFL = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift');
  const leaveOnDateAppliedDoubleHB = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateAppliedDoubleHA = leavestatusApplied.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'After Half Shift');

  const leaveOnDateRejectedSingleFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift');
  const leaveOnDateRejectedSingleHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateRejectedSingleHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'After Half Shift');

  const leaveOnDateRejectedDoubleFL = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift');
  const leaveOnDateRejectedDoubleHB = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Before Half Shift');
  const leaveOnDateRejectedDoubleHA = leavestatusRejected.find((d) => d.date === rowformattedDate && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'After Half Shift');

  if (leaveOnDateApprovedSingleFL) {
    return `${leaveOnDateApprovedSingleFL.code} ${leaveOnDateApprovedSingleFL.status}`;
  }
  else if (leaveOnDateApprovedSingleHB) {
    return `HB - ${leaveOnDateApprovedSingleHB.code} ${leaveOnDateApprovedSingleHB.status}`;
  }
  else if (leaveOnDateApprovedSingleHA) {
    return `HA - ${leaveOnDateApprovedSingleHA.code} ${leaveOnDateApprovedSingleHA.status}`;
  }
  else if (leaveOnDateApprovedDoubleFL) {
    return `DL - ${leaveOnDateApprovedDoubleFL.code} ${leaveOnDateApprovedDoubleFL.status}`;
  }
  else if (leaveOnDateApprovedDoubleHB) {
    return `DHB - ${leaveOnDateApprovedDoubleHB.code} ${leaveOnDateApprovedDoubleHB.status}`;
  }
  else if (leaveOnDateApprovedDoubleHA) {
    return `DHA - ${leaveOnDateApprovedDoubleHA.code} ${leaveOnDateApprovedDoubleHA.status}`;
  }
  else if (leaveOnDateAppliedSingleFL) {
    return `${leaveOnDateAppliedSingleFL.code} ${leaveOnDateAppliedSingleFL.status}`;
  }
  else if (leaveOnDateAppliedSingleHB) {
    return `HB - ${leaveOnDateAppliedSingleHB.code} ${leaveOnDateAppliedSingleHB.status}`;
  }
  else if (leaveOnDateAppliedSingleHA) {
    return `HA - ${leaveOnDateAppliedSingleHA.code} ${leaveOnDateAppliedSingleHA.status}`;
  }
  else if (leaveOnDateAppliedDoubleFL) {
    return `DL - ${leaveOnDateAppliedDoubleFL.code} ${leaveOnDateAppliedDoubleFL.status}`;
  }
  else if (leaveOnDateAppliedDoubleHB) {
    return `DHB - ${leaveOnDateAppliedDoubleHB.code} ${leaveOnDateAppliedDoubleHB.status}`;
  }
  else if (leaveOnDateAppliedDoubleHA) {
    return `DHA - ${leaveOnDateAppliedDoubleHA.code} ${leaveOnDateAppliedDoubleHA.status}`;
  }
  else if (leaveOnDateRejectedSingleFL) {
    return `${leaveOnDateRejectedSingleFL.code} ${leaveOnDateRejectedSingleFL.status}`;
  }
  else if (leaveOnDateRejectedSingleHB) {
    return `HB - ${leaveOnDateRejectedSingleHB.code} ${leaveOnDateRejectedSingleHB.status}`;
  }
  else if (leaveOnDateRejectedSingleHA) {
    return `HA - ${leaveOnDateRejectedSingleHA.code} ${leaveOnDateRejectedSingleHA.status}`;
  }
  else if (leaveOnDateRejectedDoubleFL) {
    return `DL - ${leaveOnDateRejectedDoubleFL.code} ${leaveOnDateRejectedDoubleFL.status}`;
  }
  else if (leaveOnDateRejectedDoubleHB) {
    return `DHB - ${leaveOnDateRejectedDoubleHB.code} ${leaveOnDateRejectedDoubleHB.status}`;
  }
  else if (leaveOnDateRejectedDoubleHA) {
    return `DHA - ${leaveOnDateRejectedDoubleHA.code} ${leaveOnDateRejectedDoubleHA.status}`;
  }

  if (permissionApprovedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "PERAPPR";
  }
  if (permissionAppliedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "PERAPPL";
  }
  if (permissionRejectedWithoutComp.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "PERREJ";
  }
  if (totalPermissionApprovedEnd.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "COMP - PERAPPR";
  }
  if (totalPermissionAppliedEnd.find((d) => moment(d.date, "YYYY-MM-DD").format("DD/MM/YYYY").includes(rowformattedDate))) {
    return "COMP - PERAPPR";
  }

  if (weekoffpresentstatus === true) {
    return 'Week Off Present';
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
  var formattedHours = String(hours).padStart(2, '0');
  var formattedMinutes = String(minutes).padStart(2, '0');

  // Combine hours and minutes into the desired format
  var currentTime = formattedHours + ":" + formattedMinutes;

  let clockOutTime = parseTime(clockouttime);
  let startTime = parseTime(rowshift?.split('to')[0]);
  let startTimeWithPM = rowshift?.split('to')[0];

  let endTime = parseTime(rowshift?.split('to')[1]);

  if (!startTime) {
    return (rowshift === 'Week Off' && clockintime === "00:00:00") ? 'Week Off' : 'Invalid start time';
  }

  if (!endTime) {
    return (rowshift === 'Week Off' && clockouttime === "00:00:00") ? 'Week Off' : (rowshift === 'Pending...' && clockouttime !== "00:00:00") ? 'Pending...' : 'Invalid end time';
  }

  // Determine if it's a night shift
  const isNightShift = startTime.getHours() >= 12;

  // Compare clockouttime based on shift type
  if (startTimeWithPM.includes('PM')) {

    // Adjust endTime if it's a night shift
    if (startTimeWithPM.includes('PM') && clockouttime.includes('AM')) {
      // Check if endTime is before startTime (indicating the shift crosses midnight)        
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1); // Move endTime to the next day
        clockOutTime.setDate(clockOutTime.getDate() + 1);
      }
    }
    else if (startTimeWithPM.includes('PM') && clockouttime.includes('PM')) {
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

    const [rowday, rowmonth, rowyear] = rowformattedDate.split('/');
    const addrowday = Number(rowday) + 1;
    const endRowDayAdd = String(addrowday).padStart(2, '0');

    const currentDate = new Date();
    const curyear = currentDate.getFullYear();
    const curmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to month as it's zero-based
    const curday = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const endHoursN8 = String(endTime?.getHours()).padStart(2, '0');
    const endMinutesN8 = String(endTime?.getMinutes()).padStart(2, '0');
    const endSecondsN8 = String(endTime?.getSeconds()).padStart(2, '0');

    const currentDateTimeString = `${curyear}-${curmonth}-${curday} ${hours}:${minutes}:${seconds}`;
    const getEndTimeForNight = `${rowyear}-${rowmonth}-${endRowDayAdd} ${endHoursN8}:${endMinutesN8}:${endSecondsN8}`;




    // Night shift
    if (isHoliday && rowshift !== "Week Off") {
      return 'Holiday';
    }
    else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(':').map(Number)) < startTime) {
      return `Shift Not Started`;
    }
    else if (clockintime === "00:00:00" && clockouttime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    }
    else if (rowshift === "Pending..." && clockouttime !== "00:00:00") {
      return `Pending...`;
    }
    else if (rowshift === "Week Off" && clockouttime === "00:00:00") {
      return `Week Off`;
    }
    else if (weekoffpresentstatus === true) {
      return 'Week Off Present';
    }
    else if (autoClockOutStatus === true && clockouttime !== "00:00:00") {
      return `Auto Mis - ClockOut`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithEarly && clockOutTime < endTime) {
      return `Early - ClockOut`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithBeforeEarly && clockOutTime < endTimeWithEarly) {
      return `HALOP`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime < endTimeWithBeforeEarly) {
      return `FLOP`;
    }
    else if (clockOutTime >= endTime && clockOutTime <= endTimeWithGrace) {
      return `On - ClockOut`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime > endTimeWithGrace) {
      return `Over - ClockOut`;
    }
    else if (clockintime !== "00:00:00" && clockouttime === "00:00:00" && currentDateTimeString <= getEndTimeForNight) {
      return `Pending`;
    }
    else if (clockouttime === "00:00:00") {
      return `Mis - ClockOut`;
    }
  } else {

    // Parse the clock in date
    const [day, month, year] = clockindate.split('-');
    const shiftStartDate = new Date(Number(year), Number(month) - 1, Number(day));
    const shiftEndDate = new Date(Number(year), Number(month) - 1, Number(day));

    // If endTime is before startTime, it indicates the shift crosses midnight
    // Adjust endTime accordingly
    if (endTime < startTime) {
      shiftEndDate.setDate(shiftEndDate.getDate() + 1); // Adjust shiftEndDate to the next day
    }

    const [rowday, rowmonth, rowyear] = rowformattedDate.split('/');
    const addrowday = Number(rowday) + 1;
    const endRowDayAdd = String(addrowday).padStart(2, '0');

    const currentDate = new Date();
    const curyear = currentDate.getFullYear();
    const curmonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to month as it's zero-based
    const curday = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const endHoursN8 = String(endTime?.getHours()).padStart(2, '0');
    const endMinutesN8 = String(endTime?.getMinutes()).padStart(2, '0');
    const endSecondsN8 = String(endTime?.getSeconds()).padStart(2, '0');


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
      return 'Holiday';
    }
    else if (clockintime === "00:00:00" && rowshift !== "Week Off" && today === rowformattedDate && new Date(2000, 0, 1, ...currentTime.split(':').map(Number)) < startTime) {
      return `Shift Not Started`;
    }
    else if (clockintime === "00:00:00" && clockouttime === "00:00:00" && rowshift !== "Week Off") {
      return `Absent`;
    }
    else if (rowshift === "Pending..." && clockouttime !== "00:00:00") {
      return `Pending...`;
    }
    else if (rowshift === "Week Off" && clockouttime === "00:00:00") {
      return `Week Off`;
    }
    else if (autoClockOutStatus === true && clockouttime !== "00:00:00") {
      return `Auto Mis - ClockOut`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithEarly && clockOutTime < endTime) {
      return `Early - ClockOut`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime >= endTimeWithBeforeEarly && clockOutTime < endTimeWithEarly) {
      return `HALOP`;
    }
    else if (clockouttime !== "00:00:00" && clockOutTime < endTimeWithBeforeEarly) {
      return `FLOP`;
    }
    else if (clockOutTime >= endTime && clockOutTime <= endTimeWithGrace) {
      return `On - ClockOut`;
    }
    else if (clockintime !== "00:00:00" && clockOutTime > endTimeWithGrace) {
      return `Over - ClockOut`;
    }
    else if (clockintime !== "00:00:00" && clockouttime === "00:00:00" && currentDateTimeString <= getEndTimeForNight) {
      return `Pending`;
    }
    else if (clockouttime === "00:00:00") {
      return `Mis - ClockOut`;
    }
  }
};

const getShiftForDate = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment) => {
  // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

  // if (selectedDateIndex === -1) {
  //     return !isWeekOff ? actualShiftTiming : "Week Off";
  // }

  if (matchingItem && matchingItem?._doc?.adjstatus === 'Adjustment') {
    return 'Pending...'
  }
  else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === 'Shift Weekoff Swap') {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  }
  else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === 'WeekOff Adjustment') {
    return matchingDoubleShiftItem?._doc?.todateshiftmode;
  }
  else if (matchingItem && matchingItem?._doc?.adjstatus === 'Approved') {

    if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === 'Shift Adjustment' || matchingItem?._doc?.adjustmenttype === 'Shift Weekoff Swap') {
      if (column.shiftMode === 'Main Shift') {
        return `${matchingItem?._doc?.adjchangeshiftime.split(' - ')[0]}to${matchingItem?._doc?.adjchangeshiftime.split(' - ')[1]}`
      } else if (column.shiftMode === 'Second Shift') {
        return `${matchingItem?._doc?.pluseshift.split(' - ')[0]}to${matchingItem?._doc?.pluseshift.split(' - ')[1]}`
      }
    }
    else {
      return (isWeekOffWithAdjustment ? (`${matchingItem?._doc?.adjchangeshiftime.split(' - ')[0]}to${matchingItem?._doc?.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem?._doc?.adjchangeshiftime.split(' - ')[0]}to${matchingItem?._doc?.adjchangeshiftime.split(' - ')[1]}`));
    }
  }
  else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
    return isWeekOffWithManual ? (`${matchingItemAllot._doc?.firstshift.split(' - ')[0]}to${matchingItemAllot?._doc?.firstshift.split(' - ')[1]} `) :
      (`${matchingItemAllot?._doc?.firstshift.split(' - ')[0]}to${matchingItemAllot?._doc?.firstshift.split(' - ')[1]} `);
  }
  else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
    return 'Week Off';
  }
  else if (matchingItem && matchingItem?._doc?.adjstatus === 'Reject' && isWeekOff) {
    // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    return 'Week Off';
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
    boardingLog.forEach(entry => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date     
    const relevantLogEntry = uniqueBoardingLog
      .filter(log => log.startdate <= finalDate)
      .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

    if (relevantLogEntry) {

      // Daily
      if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === 'Daily') {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
          }
        }
      }

      // 2 Week Rotation 2nd try working code  
      if (relevantLogEntry.shifttype === '1 Week Rotation') {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Calculate the day count until the next Sunday
        let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number                    
        const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === '2 Week Rotation') {

        // Find the matching department entry
        const matchingDepartment = overAllDepartment.find(
          (dep) =>
            dep.department === department &&
            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
        );

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment
          ? new Date(matchingDepartment.fromdate)
          : new Date(relevantLogEntry.startdate);

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

        const weekNames = [
          "1st Week",
          "2nd Week",
          "3rd Week",
          "4th Week",
          "5th Week",
          "6th Week",
          "7th Week",
          "8th Week",
          "9th Week",
        ];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

        // console.log({
        //     startDate,
        //     currentDate,
        //     endDate,
        //     diffTime,
        //     diffDays,
        //     weekNumber,
        //     finalWeek,
        // });

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota             
      if (relevantLogEntry.shifttype === '1 Month Rotation') {
        // Find the matching department entry
        const matchingDepartment = overAllDepartment.find(
          (dep) =>
            dep.department === department &&
            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
        );

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment
          ? new Date(matchingDepartment.fromdate)
          : new Date(relevantLogEntry.startdate);

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

        // console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

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
        const weekNamesFirstMonth = [
          "1st Week",
          "2nd Week",
          "3rd Week",
          "4th Week",
          "5th Week",
          "6th Week"
        ];

        const weekNamesSecondMonth = [
          "7th Week",
          "8th Week",
          "9th Week",
          "10th Week",
          "11th Week",
          "12th Week"
        ];

        // Determine which month we are in
        const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
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

        // console.log({
        //   startDate,
        //   currentDate,
        //   endDate,
        //   diffTime,
        //   diffDays,
        //   weekNumber,
        //   finalWeek,
        // });

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
    boardingLog.forEach(entry => {
      const key = entry.startdate;
      if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
        uniqueEntries[key] = entry;
      }
    });
    const uniqueBoardingLog = Object.values(uniqueEntries);

    const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    // Find the relevant log entry for the given date     
    const relevantLogEntry = uniqueBoardingLog
      .filter(log => log.startdate <= finalDate)
      .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

    if (relevantLogEntry) {

      // Daily
      if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
        // If shift type is 'Daily', return the same shift timing for each day
        //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
        return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
      }

      // 1 Week Rotation 2nd try working code
      if (relevantLogEntry.shifttype === 'Daily') {
        for (const data of relevantLogEntry.todo) {
          const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
          if (data.week === columnWeek && data.day === column.dayName) {
            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
          }
        }
      }

      // 2 Week Rotation 2nd try working code  
      if (relevantLogEntry.shifttype === '1 Week Rotation') {
        const startDate = new Date(relevantLogEntry.startdate); // Get the start date

        // Get the day name of the start date
        const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Calculate the day count until the next Sunday
        let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

        // Calculate the week number based on the day count
        let weekNumber = Math.ceil((7 - dayCount) / 7);

        // Adjust the week number considering the two-week rotation
        const logStartDate = new Date(relevantLogEntry.startdate);
        const currentDate = new Date(finalDate);

        const diffTime = Math.abs(currentDate - logStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

        // Determine the final week based on the calculated week number                    
        const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

        for (const data of relevantLogEntry.todo) {
          // Check if the adjusted week matches the column week and day
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
          }
        }
      }

      //just 2wk rotation
      if (relevantLogEntry.shifttype === '2 Week Rotation') {

        // Find the matching department entry
        const matchingDepartment = overAllDepartment.find(
          (dep) =>
            dep.department === department &&
            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
        );

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment
          ? new Date(matchingDepartment.fromdate)
          : new Date(relevantLogEntry.startdate);

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

        const weekNames = [
          "1st Week",
          "2nd Week",
          "3rd Week",
          "4th Week",
          "5th Week",
          "6th Week",
          "7th Week",
          "8th Week",
          "9th Week",
        ];
        const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

        // console.log({
        //     startDate,
        //     currentDate,
        //     endDate,
        //     diffTime,
        //     diffDays,
        //     weekNumber,
        //     finalWeek,
        // });

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }

      //just 1mont rota             
      if (relevantLogEntry.shifttype === '1 Month Rotation') {
        // Find the matching department entry
        const matchingDepartment = overAllDepartment.find(
          (dep) =>
            dep.department === department &&
            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
        );

        // Use the fromdate of the matching department as the startDate
        let startDate = matchingDepartment
          ? new Date(matchingDepartment.fromdate)
          : new Date(relevantLogEntry.startdate);

        const currentDate = new Date(finalDate);

        // Calculate month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Function to determine if a year is a leap year
        const isLeapYear = (year) => {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        // Determine the effective month for the start date
        let effectiveMonth = startDate.getMonth();
        if (startDate.getDate() > 15) {
          // Consider the next month if the start date is after the 15th
          effectiveMonth = (effectiveMonth + 1) % 12;
        }

        let totalDays = 0;

        // Calculate total days for 2-month rotation based on the effective month
        for (let i = 0; i < 2; i++) {
          const monthIndex = (effectiveMonth + i) % 12;
          totalDays += monthLengths[monthIndex];
        }

        // Set the initial endDate by adding totalDays to the startDate
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

        // Adjust February for leap years
        if (isLeapYear(endDate.getFullYear())) {
          monthLengths[1] = 29;
        }

        // Adjust startDate and endDate if the currentDate is beyond the initial endDate
        while (currentDate > endDate) {
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() + 1); // Move to the next day

          // Determine the new effective month for the next cycle
          effectiveMonth = startDate.getMonth();
          if (startDate.getDate() > 15) {
            effectiveMonth = (effectiveMonth + 1) % 12;
          }

          totalDays = 0;
          for (let i = 0; i < 2; i++) {
            const monthIndex = (effectiveMonth + i) % 12;
            totalDays += monthLengths[monthIndex];
          }

          // Set the new endDate by adding totalDays to the new startDate
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

          // Adjust February for leap years
          if (isLeapYear(endDate.getFullYear())) {
            monthLengths[1] = 29;
          }
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
        const weekNamesFirstMonth = [
          "1st Week",
          "2nd Week",
          "3rd Week",
          "4th Week",
          "5th Week",
          "6th Week"
        ];

        const weekNamesSecondMonth = [
          "7th Week",
          "8th Week",
          "9th Week",
          "10th Week",
          "11th Week",
          "12th Week"
        ];

        // Determine which month we are in
        const daysInFirstMonth = monthLengths[effectiveMonth];
        let finalWeek;

        if (diffDays <= daysInFirstMonth) {
          // We're in the first month of the cycle
          weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
          finalWeek = weekNamesFirstMonth[weekNumber - 1];
        } else {
          // We're in the second month of the cycle
          const daysInSecondMonth = totalDays - daysInFirstMonth;
          const secondMonthDay = diffDays - daysInFirstMonth;

          // Calculate week number based on Monday-Sunday for the second month
          const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
          const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
          const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
          const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

          finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
        }

        // console.log({
        //     startDate,
        //     currentDate,
        //     endDate,
        //     diffTime,
        //     diffDays,
        //     weekNumber,
        //     finalWeek,
        // });

        for (const data of relevantLogEntry.todo) {
          if (data.week === finalWeek && data.day === column.dayName) {
            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
          }
        }
      }
    }
  }
}

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

// Compare manual date with with formattedDate
const formatDate = (inputDate) => {
  if (!inputDate) {
    return ""
  }
  // Assuming inputDate is in the format "dd-mm-yyyy"
  const [day, month, year] = inputDate?.split('/');

  // Use padStart to add leading zeros
  const formattedDay = String(day)?.padStart(2, '0');
  const formattedMonth = String(month)?.padStart(2, '0');

  return `${formattedDay}/${formattedMonth}/${year}`;
};


// getUserWeekOffDays
exports.getUserWeekOffDays = catchAsyncErrors(async (req, res, next) => {
  let users;
  let controlcriteria;
  let depMonthSet;
  let shift;
  let attendance;
  let allLeaveStatus;
  let leavetype;
  let permission;
  let holidays;
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
  const { userDates, } = req.body;

  // const formattedUserDates = userDates.map((data) => moment(data.formattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"));

  try {
    users = await User.find(
      {
        companyname: req.body.empname,
        department: req.body.department,
        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },
      }, {
      company: 1, branch: 1, unit: 1, team: 1, department: 1, doj: 1, empcode: 1, department: 1,
      companyname: 1, team: 1, floor: 1, username: 1, designation: 1, weekoff: 1, shiftallot: 1, shifttiming: 1,
      boardingLog: 1, reasondate: 1,
    }
    );

    let deptQuery = req.body.deptQuery;
    depMonthSet = await DepartmentMonth.find(deptQuery, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 });

    controlcriteria = await ControlCriteria.find();
    shift = await Shift.find({}, { name: 1, fromhour: 1, tohour: 1, frommin: 1, tomin: 1, fromtime: 1, totime: 1 });

    attendance = await Attendance.find({ username: req.body.username }, {});
    allLeaveStatus = await ApplyLeave.find({ employeeid: req.body.empcode, employeename: req.body.empname }, {});

    holidays = await Holiday.find({ employee: { $in: req.body.empname } }, { date: 1, company: 1, applicablefor: 1, unit: 1, team: 1, employee: 1, noofdays: 1 });
    leavetype = await Leavetype.find({}, { leavetype: 1, code: 1 });
    permission = await Permission.find({ employeeid: req.body.empcode }, { employeeid: 1, date: 1, status: 1, applytype: 1, compensationstatus: 1, compensationapplytype: 1, requesthours: 1 });

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
    console.log(users.length)

    finaluser = users?.flatMap((item, index) => {

      let isEmployeeGrace = controlcriteria[0].todos && controlcriteria[0].todos.find(d => d.company === item.company &&
        d.branch === item.branch && d.unit === item.unit && d.team === item.team &&
        d.employeename === item.companyname
      )

      if (isEmployeeGrace) {
        graceTime = isEmployeeGrace.employeegracetime;
      }
      else {
        graceTime = controlcriteria[0].gracetime;
      }

      item.shiftallot?.map(allot => {
        resultshiftallot.push({ ...allot })
      })

      const filteredMatchingDoubleShiftItem = resultshiftallot?.filter(val => val && val?._doc?.empcode === item?._doc?.empcode && val?._doc?.adjstatus === 'Approved');

      // Filter out the dates that have matching 'Shift Adjustment' todates
      let removedUserDates = userDates.filter(date => {
        // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
        const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem.find(item => item && item?._doc?.todate === date.formattedDate && item?._doc?.adjustmenttype === 'Shift Adjustment');

        // If there is no matching 'Shift Adjustment', keep the date
        return !matchingShiftAdjustmentToDate;
      });

      // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
      let uniqueEntries = new Set();

      // Iterate over removedUserDates and add unique entries to the Set
      removedUserDates.forEach(date => {
        uniqueEntries.add(JSON.stringify({
          formattedDate: date.formattedDate,
          dayName: date.dayName,
          dayCount: date.dayCount,
          shiftMode: 'Main Shift',
          weekNumberInMonth: date.weekNumberInMonth,
        }));
      });

      // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
      filteredMatchingDoubleShiftItem.forEach(item => {
        const [day, month, year] = item._doc.adjdate?.split('/')
        let newFormattedDate = new Date(`${year}-${month}-${day}`);

        if (item._doc.adjustmenttype === 'Shift Adjustment' || item._doc.adjustmenttype === 'Add On Shift' || item._doc.adjustmenttype === 'Shift Weekoff Swap') {
          uniqueEntries.add(JSON.stringify({
            formattedDate: item._doc.adjdate,
            dayName: moment(item._doc.adjdate, "DD/MM/YYYY").format("dddd"),
            dayCount: parseInt(moment(item._doc.adjdate, "DD/MM/YYYY").format("DD")),
            shiftMode: 'Second Shift',
            weekNumberInMonth: (getWeekNumberInMonth(newFormattedDate) === 1 ? `${getWeekNumberInMonth(newFormattedDate)}st Week` :
              getWeekNumberInMonth(newFormattedDate) === 2 ? `${getWeekNumberInMonth(newFormattedDate)}nd Week` :
                getWeekNumberInMonth(newFormattedDate) === 3 ? `${getWeekNumberInMonth(newFormattedDate)}rd Week` :
                  getWeekNumberInMonth(newFormattedDate) > 3 ? `${getWeekNumberInMonth(newFormattedDate)}th Week` : '')
          }));
        }
      });

      // Convert Set back to an array of objects
      let createdUserDatesUnique = Array.from(uniqueEntries).map(entry => JSON.parse(entry));

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
      const createdUserDates = sortedCreatedUserDates?.filter(d => {
        const filterData = userDates.some(val => val.formattedDate === d.formattedDate);
        if (filterData) {
          return d;
        }
      });

      // Map each user date to a row
      const userRows = createdUserDates?.map((date) => {
        let filteredRowData = resultshiftallot?.filter((val) => val?._doc?.empcode == item?._doc?.empcode);
        const matchingItem = filteredRowData?.find(item => item && item?._doc?.adjdate == date.formattedDate);
        const matchingItemAllot = filteredRowData?.find(item => item && formatDate(item?._doc?.date) == date.formattedDate);
        const matchingDoubleShiftItem = filteredRowData.find(item => item && item?._doc?.todate === date.formattedDate);

        const filterBoardingLog = item?._doc?.boardingLog && item?._doc?.boardingLog?.filter((item) => {
          // return item.logcreation === "user" || item.logcreation === "shift";
          return item;
        });

        // Check if the dayName is Sunday or Monday
        // const isWeekOff = item?._doc?.weekoff?.includes(date.dayName);
        const isWeekOff = getWeekOffDay(date, filterBoardingLog, req.body.department, depMonthSet) === "Week Off" ? true : false;

        const isWeekOffWithAdjustment = isWeekOff && matchingItem;
        const isWeekOffWithManual = isWeekOff && matchingItemAllot;

        // console.log(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet, 'shift')

        const row = {
          id: `${item?._doc?._id.toString()}_${date.formattedDate}_${date.shiftMode}`,
          userid: item?._doc?._id.toString(),
          company: item?._doc?.company,
          branch: item?._doc?.branch,
          unit: item?._doc?.unit,
          team: item?._doc?.team,
          department: req.body.department,
          username: item?._doc?.companyname,
          empcode: item?._doc?.empcode,
          weekoff: item?._doc?.weekoff,
          boardingLog: item?._doc?.boardingLog,
          shiftallot: item?._doc?.shiftallot,
          shift: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet),
          date: `${date.formattedDate} ${date.dayName} ${date.dayCount} `,
          rowformattedDate: date.formattedDate,
          dayName: date.dayName,
          shiftMode: date.shiftMode,
          reasondate: item?._doc?.reasondate,
          clockin: checkGetClockInTime(attendance, item?._doc?._id.toString(), date.formattedDate,
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet),
            date.shiftMode,
          ),
          clockout: checkGetClockOutTime(attendance, item?._doc?._id.toString(), date.formattedDate,
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet),
            date.shiftMode,
          ),
          clockinstatus: checkClockInStatus(
            checkGetClockInTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet), date.shiftMode,),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet),
            graceTime, allLeaveStatus, holidays,
            checkGetClockInDate(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,), item?._doc.branch, item?._doc?.empcode, item?._doc.company, date.formattedDate, item?._doc.unit, item?._doc.team, item?._doc.companyname,
            earlyclockin, lateclockin, afterlateclockin, leavetype, permission,
            checkGetClockOutTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet), date.shiftMode,),
            date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,)

          ),
          clockoutstatus: checkClockOutStatus(
            checkGetClockOutTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet), date.shiftMode,),
            checkGetClockInTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet), date.shiftMode,),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, req.body.department, depMonthSet),
            clockOutHours, checkGetClockInDate(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
            allLeaveStatus, holidays, item?._doc.branch, item?._doc?.empcode, item?._doc.company, date.formattedDate, item?._doc.unit, item?._doc.team, item?._doc.companyname, onclockout,
            earlyclockout, beforeearlyclockout,
            checkGetClockInAutoStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
            leavetype, permission, date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,)

          ),
          attendanceautostatus: checkAttendanceStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
          lateclockincount: lateclockincount,
          earlyclockoutcount: earlyclockoutcount,
          weekoffpresentstatus: checkWeekOffPresentStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
        };

        return row;
      });

      return userRows;

    });
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!finaluser) {
    return next(new ErrorHandler("Users not found", 400));
  }

  return res.status(200).json({ finaluser });
});



// get All ProductionDayList => /api/productiondaylistss
// exports.getAllProductionsByUserForCurrMonth = catchAsyncErrors(async (req, res, next) => {
//   let productions, productionsManual;
//   try {
//     const { empname, department, user } = req.body;

//     let dateNow = new Date();
//     let datevalue = dateNow.toISOString().split("T")[0];

//     const findCurrdeptMonthSets = await DepartmentMonth.find({
//       fromdate: { $lte: datevalue },
//       todate: { $gte: datevalue },
//       year: dateNow.getFullYear(),
//       department: department,
//     }, { fromdate: 1, todate: 1 });


//     let currMonthFromdate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].fromdate : "";
//     let currMonthTodate = findCurrdeptMonthSets ? findCurrdeptMonthSets[0].todate : "";

//     function getDatesBetween(fromDate, toDate) {
//       const dates = [];
//       let currentDate = new Date(fromDate);
//       // Convert toDate to a Date object
//       const endDate = new Date(toDate);
//       // Loop until the currentDate is greater than endDate
//       while (currentDate <= endDate) {
//         // Push the formatted date string to the dates array
//         dates.push(currentDate.toISOString().split("T")[0]);
//         // Increment currentDate by 1 day
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//       return dates; // Return the array of date strings
//     }

//     const datesArray = getDatesBetween(currMonthFromdate, currMonthTodate);

//     const query = {
//       user: user,

//       $or: datesArray.map((date) => ({
//         fromdate: date
//       }))
//     };
//     const queryManual = {
//       user: user,
//       status: "Approved",
//       $or: datesArray.map((date) => ({
//         fromdate: date
//       }))
//     };

//     productions = await ProductionUpload.find(query, { filename: 1, dateval: 1, user: 1 }).lean();
//     productionsManual = await ProducionIndividual.find(queryManual, { filename: 1, fromdate: 1, time: 1, user: 1, mode: 1 }).lean();

//   } catch (err) {
//     console.log(err.message);
//   }
//   // if (!productions) {
//   //   return next(new ErrorHandler("Data not found!", 404));
//   // }
//   return res.status(200).json({
//     // count: products.length,
//     productions, productionsManual
//   });
// });
exports.getAllProductionsByUserForCurrMonth = catchAsyncErrors(async (req, res, next) => {
  try {
    const { empname, department, user } = req.body;
    console.log(user)
    let dateNow = new Date();
    let datevalue = dateNow.toISOString().split("T")[0];

    // Fetch the department month range
    const findCurrdeptMonthSets = await DepartmentMonth.findOne({
      fromdate: { $lte: datevalue },
      todate: { $gte: datevalue },
      year: dateNow.getFullYear(),
      department: department,
    }, { fromdate: 1, todate: 1 });

    // Get the fromdate and todate from the department month
    let currMonthFromdate = findCurrdeptMonthSets ? findCurrdeptMonthSets.fromdate : "";
    let currMonthTodate = findCurrdeptMonthSets ? findCurrdeptMonthSets.todate : "";

    if (!currMonthFromdate || !currMonthTodate) {
      return next(new ErrorHandler("Current month range not found", 404));
    }

    // Define query objects with optimized date range filters
    const query = {
      user: { $in: user },
      fromdate: { $gte: currMonthFromdate, $lte: currMonthTodate }
    };

    const queryManual = {
      user: { $in: user },
      status: "Approved",
      fromdate: { $gte: currMonthFromdate, $lte: currMonthTodate }
    };

    // Use Promise.all to execute queries in parallel
    const [productions, productionsManual] = await Promise.all([
      ProductionUpload.find(query, { filename: 1, dateval: 1, user: 1 }).lean(),
      ProducionIndividual.find(queryManual, { filename: 1, fromdate: 1, time: 1, user: 1, mode: 1 }).lean()
    ]);

    return res.status(200).json({
      productions,
      productionsManual
    });

  } catch (err) {
    console.log(err.message);
    return next(new ErrorHandler("Failed to fetch data", 500));
  }
});



exports.getAllProductionsByUserForCurrMonthView = catchAsyncErrors(async (req, res, next) => {
  let productiondaylists, productiondaylistsManual;
  try {

    const { ids } = req.body;

    productiondaylists = await ProductionUpload.find({ _id: { $in: ids } }, {
      project: 1,
      category: 1, filename: 1, fromtodate: 1, user: 1, unitid: 1, unitrate: 1, dateval: 1, vendor: 1, points: 1,
      flagcount: 1, section: 1,
    });
    productiondaylistsManual = await ProducionIndividual.find({ _id: { $in: ids }, status: "Approved" }, {
      project: 1,
      category: 1, filename: 1, fromtodate: 1, user: 1, unitid: 1, unitrate: 1, fromdate: 1, time: 1, vendor: 1, points: 1,
      mode: 1, flagcount: 1, section: 1,
    });


  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    // count: products.length,
    productiondaylists, productiondaylistsManual
  });
});


exports.getUserWeekOffDaysAttendance = catchAsyncErrors(async (req, res, next) => {
  let users;
  let controlcriteria;
  let depMonthSet;
  let shift;
  let attendance;
  let allLeaveStatus;
  let leavetype;
  let permission;
  let holidays;
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
  const { userDates, } = req.body;

  // const formattedUserDates = userDates.map((data) => moment(data.formattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"));

  try {
    users = await User.find(
      {
        companyname: { $in: req.body.empname },

        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },
      }, {
      company: 1, branch: 1, unit: 1, team: 1, department: 1, doj: 1, empcode: 1, department: 1,
      companyname: 1, team: 1, floor: 1, username: 1, designation: 1, weekoff: 1, shiftallot: 1, shifttiming: 1,
      boardingLog: 1, reasondate: 1,
    }
    );
    depMonthSet = await DepartmentMonth.find({}, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 });

    controlcriteria = await ControlCriteria.find();
    shift = await Shift.find({}, { name: 1, fromhour: 1, tohour: 1, frommin: 1, tomin: 1, fromtime: 1, totime: 1 });

    attendance = await Attendance.find({ username: { $in: req.body.username } }, {});
    allLeaveStatus = await ApplyLeave.find({ employeeid: req.body.empcode, employeename: req.body.empname }, {});

    holidays = await Holiday.find({ employee: { $in: req.body.empname } }, { date: 1, company: 1, applicablefor: 1, unit: 1, team: 1, employee: 1, noofdays: 1 });
    leavetype = await Leavetype.find({}, { leavetype: 1, code: 1 });
    permission = await Permission.find({ employeeid: req.body.empcode }, { employeeid: 1, date: 1, status: 1, applytype: 1, compensationstatus: 1, compensationapplytype: 1, requesthours: 1 });

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
    console.log(users.length)

    finaluser = users?.flatMap((item, index) => {

      let isEmployeeGrace = controlcriteria[0].todos && controlcriteria[0].todos.find(d => d.company === item.company &&
        d.branch === item.branch && d.unit === item.unit && d.team === item.team &&
        d.employeename === item.companyname
      )

      if (isEmployeeGrace) {
        graceTime = isEmployeeGrace.employeegracetime;
      }
      else {
        graceTime = controlcriteria[0].gracetime;
      }

      item.shiftallot?.map(allot => {
        resultshiftallot.push({ ...allot })
      })

      const filteredMatchingDoubleShiftItem = resultshiftallot?.filter(val => val && val?._doc?.empcode === item?._doc?.empcode && val?._doc?.adjstatus === 'Approved');

      // Filter out the dates that have matching 'Shift Adjustment' todates
      let removedUserDates = userDates.filter(date => {
        // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
        const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem.find(item => item && item?._doc?.todate === date.formattedDate && item?._doc?.adjustmenttype === 'Shift Adjustment');

        // If there is no matching 'Shift Adjustment', keep the date
        return !matchingShiftAdjustmentToDate;
      });

      // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
      let uniqueEntries = new Set();

      // Iterate over removedUserDates and add unique entries to the Set
      removedUserDates.forEach(date => {
        uniqueEntries.add(JSON.stringify({
          formattedDate: date.formattedDate,
          dayName: date.dayName,
          dayCount: date.dayCount,
          shiftMode: 'Main Shift',
          weekNumberInMonth: date.weekNumberInMonth,
        }));
      });

      // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
      filteredMatchingDoubleShiftItem.forEach(item => {
        const [day, month, year] = item._doc.adjdate?.split('/')
        let newFormattedDate = new Date(`${year}-${month}-${day}`);

        if (item._doc.adjustmenttype === 'Shift Adjustment' || item._doc.adjustmenttype === 'Add On Shift' || item._doc.adjustmenttype === 'Shift Weekoff Swap') {
          uniqueEntries.add(JSON.stringify({
            formattedDate: item._doc.adjdate,
            dayName: moment(item._doc.adjdate, "DD/MM/YYYY").format("dddd"),
            dayCount: parseInt(moment(item._doc.adjdate, "DD/MM/YYYY").format("DD")),
            shiftMode: 'Second Shift',
            weekNumberInMonth: (getWeekNumberInMonth(newFormattedDate) === 1 ? `${getWeekNumberInMonth(newFormattedDate)}st Week` :
              getWeekNumberInMonth(newFormattedDate) === 2 ? `${getWeekNumberInMonth(newFormattedDate)}nd Week` :
                getWeekNumberInMonth(newFormattedDate) === 3 ? `${getWeekNumberInMonth(newFormattedDate)}rd Week` :
                  getWeekNumberInMonth(newFormattedDate) > 3 ? `${getWeekNumberInMonth(newFormattedDate)}th Week` : '')
          }));
        }
      });

      // Convert Set back to an array of objects
      let createdUserDatesUnique = Array.from(uniqueEntries).map(entry => JSON.parse(entry));

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
      const createdUserDates = sortedCreatedUserDates?.filter(d => {
        const filterData = userDates.some(val => val.formattedDate === d.formattedDate);
        if (filterData) {
          return d;
        }
      });

      // Map each user date to a row
      const userRows = createdUserDates?.map((date) => {
        let filteredRowData = resultshiftallot?.filter((val) => val?._doc?.empcode == item?._doc?.empcode);
        const matchingItem = filteredRowData?.find(item => item && item?._doc?.adjdate == date.formattedDate);
        const matchingItemAllot = filteredRowData?.find(item => item && formatDate(item?._doc?.date) == date.formattedDate);
        const matchingDoubleShiftItem = filteredRowData.find(item => item && item?._doc?.todate === date.formattedDate);

        const filterBoardingLog = item?._doc?.boardingLog && item?._doc?.boardingLog?.filter((item) => {
          return item.logcreation === "user" || item.logcreation === "shift";
          // return item;
        });

        // Check if the dayName is Sunday or Monday
        // const isWeekOff = item?._doc?.weekoff?.includes(date.dayName);
        const isWeekOff = getWeekOffDay(date, filterBoardingLog, item.department, depMonthSet) === "Week Off" ? true : false;

        const isWeekOffWithAdjustment = isWeekOff && matchingItem;
        const isWeekOffWithManual = isWeekOff && matchingItemAllot;

        // console.log(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet, 'shift')

        const row = {
          id: `${item?._doc?._id.toString()}_${date.formattedDate}_${date.shiftMode}`,
          userid: item?._doc?._id.toString(),
          company: item?._doc?.company,
          branch: item?._doc?.branch,
          unit: item?._doc?.unit,
          team: item?._doc?.team,
          department: item.department,
          username: item?._doc?.companyname,
          empcode: item?._doc?.empcode,
          weekoff: item?._doc?.weekoff,
          boardingLog: item?._doc?.boardingLog,
          shiftallot: item?._doc?.shiftallot,
          shift: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet),
          date: `${date.formattedDate} ${date.dayName} ${date.dayCount} `,
          rowformattedDate: date.formattedDate,
          dayName: date.dayName,
          shiftMode: date.shiftMode,
          reasondate: item?._doc?.reasondate,
          clockin: checkGetClockInTime(attendance, item?._doc?._id.toString(), date.formattedDate,
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet),
            date.shiftMode,
          ),
          clockout: checkGetClockOutTime(attendance, item?._doc?._id.toString(), date.formattedDate,
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet),
            date.shiftMode,
          ),
          clockinstatus: checkClockInStatus(
            checkGetClockInTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet), date.shiftMode,),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet),
            graceTime, allLeaveStatus, holidays,
            checkGetClockInDate(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,), item?._doc.branch, item?._doc?.empcode, item?._doc.company, date.formattedDate, item?._doc.unit, item?._doc.team, item?._doc.companyname,
            earlyclockin, lateclockin, afterlateclockin, leavetype, permission,
            checkGetClockOutTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet), date.shiftMode,),
            date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,)

          ),
          clockoutstatus: checkClockOutStatus(
            checkGetClockOutTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet), date.shiftMode,),
            checkGetClockInTime(attendance, item?._doc?._id.toString(), date.formattedDate, getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet), date.shiftMode,),
            getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department, depMonthSet),
            clockOutHours, checkGetClockInDate(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
            allLeaveStatus, holidays, item?._doc.branch, item?._doc?.empcode, item?._doc.company, date.formattedDate, item?._doc.unit, item?._doc.team, item?._doc.companyname, onclockout,
            earlyclockout, beforeearlyclockout,
            checkGetClockInAutoStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
            leavetype, permission, date.shiftMode,
            checkWeekOffPresentStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,)

          ),
          attendanceautostatus: checkAttendanceStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
          lateclockincount: lateclockincount,
          earlyclockoutcount: earlyclockoutcount,
          weekoffpresentstatus: checkWeekOffPresentStatus(attendance, item?._doc?._id.toString(), date.formattedDate, date.shiftMode,),
        };

        return row;
      });

      return userRows;

    });
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!finaluser) {
    return next(new ErrorHandler("Users not found", 400));
  }

  return res.status(200).json({ finaluser });
});

