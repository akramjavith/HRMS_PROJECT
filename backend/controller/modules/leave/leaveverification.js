const LeaveVerification = require("../../../model/modules/leave/leaveverification");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");

//get All LeaveVerification =>/api/LeaveVerification
exports.getAllLeaveVerifcation = catchAsyncErrors(async (req, res, next) => {
  let teamgroupings;
  try {
    teamgroupings = await LeaveVerification.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!teamgroupings) {
    return next(new ErrorHandler("LeaveVerification not found!", 404));
  }
  return res.status(200).json({
    teamgroupings,
  });
});

//create new LeaveVerification => /api/LeaveVerification/new
exports.addLeaveVerifcation = catchAsyncErrors(async (req, res, next) => {
  
  let aTeamgrouping = await LeaveVerification.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single LeaveVerification => /api/LeaveVerification/:id
exports.getSingleLeaveVerifcation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let steamgrouping = await LeaveVerification.findById(id);
  if (!steamgrouping) {
    return next(new ErrorHandler("LeaveVerification not found", 404));
  }
  return res.status(200).json({
    steamgrouping,
  });
});

//update LeaveVerification by id => /api/LeaveVerification/:id
exports.updateLeaveVerifcation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uteamgrouping = await LeaveVerification.findByIdAndUpdate(id, req.body);
  if (!uteamgrouping) {
    return next(new ErrorHandler("LeaveVerification not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete LeaveVerification by id => /api/LeaveVerification/:id
exports.deleteLeaveVerifcation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dteamgrouping = await LeaveVerification.findByIdAndRemove(id);
  if (!dteamgrouping) {
    return next(new ErrorHandler("LeaveVerification not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});