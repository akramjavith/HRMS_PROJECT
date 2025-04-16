const AttendanceStatus = require("../../../model/modules/attendance/attendancestatusmaster");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All AttendanceStatus =>/api/AttendanceStatus
exports.getAllAttendanceStatus = catchAsyncErrors(async (req, res, next) => {
  let attendancestatus;
  try {
    attendancestatus = await AttendanceStatus.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!attendancestatus) {
    return next(new ErrorHandler("AttendanceStatus not found!", 404));
  }
  return res.status(200).json({
    attendancestatus,
  });
});

//create new AttendanceStatus => /api/AttendanceStatus/new
exports.addAttendanceStatus = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let attendancestatus = await AttendanceStatus.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single AttendanceStatus => /api/AttendanceStatus/:id
exports.getSingleAttendanceStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sattendancestatus = await AttendanceStatus.findById(id);
  if (!sattendancestatus) {
    return next(new ErrorHandler("AttendanceStatus not found", 404));
  }
  return res.status(200).json({
    sattendancestatus,
  });
});

//update AttendanceStatus by id => /api/AttendanceStatus/:id
exports.updateAttendanceStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uattendancestatus = await AttendanceStatus.findByIdAndUpdate(id, req.body);
  if (!uattendancestatus) {
    return next(new ErrorHandler("AttendanceStatus not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete AttendanceStatus by id => /api/AttendanceStatus/:id
exports.deleteAttendanceStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dattendancestatus = await AttendanceStatus.findByIdAndRemove(id);
  if (!dattendancestatus) {
    return next(new ErrorHandler("AttendanceStatus not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

