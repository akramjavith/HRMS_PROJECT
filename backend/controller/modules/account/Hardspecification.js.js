const Hardwarespecification = require("../../../model/modules/account/Hardwarespecification");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Hardwarespecification Name => /api/operatingsystem
exports.getAllHardwarespecification = catchAsyncErrors(async (req, res, next) => {
  let hardwarespecification;
  try {
    hardwarespecification = await Hardwarespecification.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    hardwarespecification,
  });
});

exports.getTypeHardwarespecification = catchAsyncErrors(async (req, res, next) => {
  let hardwarespecification;
  try {
    hardwarespecification = await Hardwarespecification.find({ type: req.body.type }, { name: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    hardwarespecification,
  });
});


// Create new Hardwarespecification=> /api/operatingsystem/new
exports.addHardwarespecification = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Hardwarespecification.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let ahardwarespecification = await Hardwarespecification.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Hardwarespecification => /api/operatingsystem/:id
exports.getSingleHardwarespecification = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let shardwarespecification = await Hardwarespecification.findById(id);

  if (!shardwarespecification) {
    return next(new ErrorHandler("Hardwarespecification Name not found!", 404));
  }
  return res.status(200).json({
    shardwarespecification,
  });
});

// update Hardwarespecification by id => /api/operatingsystem/:id
exports.updateHardwarespecification = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uhardwarespecification = await Hardwarespecification.findByIdAndUpdate(id, req.body);
  if (!uhardwarespecification) {
    return next(new ErrorHandler("Hardwarespecification Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Hardwarespecification by id => /api/operatingsystem/:id
exports.deleteHardwarespecification = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dhardwarespecification = await Hardwarespecification.findByIdAndRemove(id);

  if (!dhardwarespecification) {
    return next(new ErrorHandler("Hardwarespecification Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
