const CompatibleDevices = require('../../../model/modules/account/CompatibleDevicesModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All CompatibleDevices Name => /api/compatibledevicess
exports.getAllCompatibleDevices = catchAsyncErrors(async (req, res, next) => {
  let compatibledevices;
  try {
    compatibledevices = await CompatibleDevices.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!compatibledevices) {
    return next(new ErrorHandler("CompatibleDevices Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    compatibledevices,
  });
});

// Create new CompatibleDevices=> /api/compatibledevices/new
exports.addCompatibleDevices = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await CompatibleDevices.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("CompatibleDevices Name already exist!", 400));
  }

  let acompatibledevices = await CompatibleDevices.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle CompatibleDevices => /api/compatibledevices/:id
exports.getSingleCompatibleDevices = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let scompatibledevices = await CompatibleDevices.findById(id);

  if (!scompatibledevices) {
    return next(new ErrorHandler("CompatibleDevices Name not found!", 404));
  }
  return res.status(200).json({
    scompatibledevices,
  });
});

// update CompatibleDevices by id => /api/compatibledevices/:id
exports.updateCompatibleDevices = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucompatibledevices = await CompatibleDevices.findByIdAndUpdate(id, req.body);
  if (!ucompatibledevices) {
    return next(new ErrorHandler("CompatibleDevices Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete CompatibleDevices by id => /api/compatibledevices/:id
exports.deleteCompatibleDevices = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dcompatibledevices = await CompatibleDevices.findByIdAndRemove(id);

  if (!dcompatibledevices) {
    return next(new ErrorHandler("CompatibleDevices Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
