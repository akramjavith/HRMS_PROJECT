const Speed = require('../../../model/modules/account/SpeedModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Speed Name => /api/speeds
exports.getAllSpeed = catchAsyncErrors(async (req, res, next) => {
  let speed;
  try {
    speed = await Speed.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!speed) {
    return next(new ErrorHandler("Speed Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    speed,
  });
});

// Create new Speed=> /api/speed/new
exports.addSpeed = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Speed.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Speed Name already exist!", 400));
  }

  let aspeed = await Speed.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Speed => /api/speed/:id
exports.getSingleSpeed = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sspeed = await Speed.findById(id);

  if (!sspeed) {
    return next(new ErrorHandler("Speed Name not found!", 404));
  }
  return res.status(200).json({
    sspeed,
  });
});

// update Speed by id => /api/speed/:id
exports.updateSpeed = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uspeed = await Speed.findByIdAndUpdate(id, req.body);
  if (!uspeed) {
    return next(new ErrorHandler("Speed Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Speed by id => /api/speed/:id
exports.deleteSpeed = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dspeed = await Speed.findByIdAndRemove(id);

  if (!dspeed) {
    return next(new ErrorHandler("Speed Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
