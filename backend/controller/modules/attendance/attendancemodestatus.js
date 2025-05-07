const Attendancemodestatus = require("../../../model/modules/attendance/attendancemodestatus");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const AttendanceStatus = require("../../../model/modules/attendance/attendancestatusmaster");
//get All Attendancemodestatus =>/api/Attendancemodestatus
exports.getAllAttendanceModeStatus = catchAsyncErrors(async (req, res, next) => {
  let allattmodestatus;
  try {
    allattmodestatus = await Attendancemodestatus.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!allattmodestatus) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    allattmodestatus,
  });
});

//create new Attendancemodestatus => /api/Attendancemodestatus/new
exports.addAttendanceModeStatus = catchAsyncErrors(async (req, res, next) => {

  let attendancemodestatus = await Attendancemodestatus.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Attendancemodestatus => /api/Attendancemodestatus/:id
exports.getSingleAttendanceModeStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sattendancemodestatus = await Attendancemodestatus.findById(id);
  if (!sattendancemodestatus) {
    return next(new ErrorHandler("Data not found", 404));
  }
  return res.status(200).json({
    sattendancemodestatus,
  });
});

//update Attendancemodestatus by id => /api/Attendancemodestatus/:id
exports.updateAttendanceModeStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uattendancemodestatus = await Attendancemodestatus.findByIdAndUpdate(id, req.body);
  if (!uattendancemodestatus) {
    return next(new ErrorHandler("Data not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Attendancemodestatus by id => /api/Attendancemodestatus/:id
exports.deleteAttendanceModeStatus = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dattendancemodestatus = await Attendancemodestatus.findByIdAndRemove(id);
  if (!dattendancemodestatus) {
    return next(new ErrorHandler("Datas not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAlloveralldeleteattstatus = catchAsyncErrors(async (req, res, next) => {
  let attendancestatusmaster;
  try {
    let query = {
      name: req.body.checkstatus,
    };
    console.log(query)
    attendancestatusmaster = await AttendanceStatus.find(query, {
      name: 1,
      // _id: 1,
    });
    console.log(attendancestatusmaster.length)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!attendancestatusmaster) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    attendancestatusmaster,
  });
});


// get overall Edit functionality
exports.getAlloveralleditattstatus = catchAsyncErrors(async (req, res, next) => {
  let ebuse;
  try {

    ebuse = await AttendanceStatus.find({ name: { $in: req.body.oldname } })



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ebuse) {
    return next(new ErrorHandler("Ebservicemaster not found!", 404));
  }
  return res.status(200).json({
    count: ebuse.length,
    ebuse,
  });
});
