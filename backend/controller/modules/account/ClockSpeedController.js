const ClockSpeed = require('../../../model/modules/account/ClockSpeedModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ClockSpeed Name => /api/clockspeeds
exports.getAllClockSpeed = catchAsyncErrors(async (req, res, next) => {
  let clockspeed;
  try {
    clockspeed = await ClockSpeed.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clockspeed) {
    return next(new ErrorHandler("ClockSpeed Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clockspeed,
  });
});

// Create new ClockSpeed=> /api/clockspeed/new
exports.addClockSpeed = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await ClockSpeed.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("ClockSpeed Name already exist!", 400));
  }

  let aclockspeed = await ClockSpeed.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ClockSpeed => /api/clockspeed/:id
exports.getSingleClockSpeed = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sclockspeed = await ClockSpeed.findById(id);

  if (!sclockspeed) {
    return next(new ErrorHandler("ClockSpeed Name not found!", 404));
  }
  return res.status(200).json({
    sclockspeed,
  });
});

// update ClockSpeed by id => /api/clockspeed/:id
exports.updateClockSpeed = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uclockspeed = await ClockSpeed.findByIdAndUpdate(id, req.body);
  if (!uclockspeed) {
    return next(new ErrorHandler("ClockSpeed Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ClockSpeed by id => /api/clockspeed/:id
exports.deleteClockSpeed = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dclockspeed = await ClockSpeed.findByIdAndRemove(id);

  if (!dclockspeed) {
    return next(new ErrorHandler("ClockSpeed Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
