const WavierPercentage = require("../../../model/modules/penalty/wavierpercentage");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All wavierpercentage => /api/wavierpercentage
exports.getAllWavierpercentage = catchAsyncErrors(async (req, res, next) => {
  let wavierpercentage;
  try {
    wavierpercentage = await WavierPercentage.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!wavierpercentage) {
    return next(new ErrorHandler("Wavierpercentage not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    wavierpercentage,
  });
});

// Create new Wavierpercentage=> /api/Wavierpercentage/new
exports.addWavierpercentage = catchAsyncErrors(async (req, res, next) => {
  let awavierpercentage = await WavierPercentage.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle wavierpercentage => /api/wavierpercentage/:id
exports.getSingleWavierpercentage = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let swavierpercentage = await WavierPercentage.findById(id);

  if (!swavierpercentage) {
    return next(new ErrorHandler("Wavierpercentage not found!", 404));
  }
  return res.status(200).json({
    swavierpercentage,
  });
});

// update Wavierpercentage by id => /api/Wavierpercentage/:id
exports.updateWavierpercentage = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uwavierpercentage = await WavierPercentage.findByIdAndUpdate(id, req.body);
  if (!uwavierpercentage) {
    return next(new ErrorHandler("Wavierpercentage not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete wavierpercentage by id => /api/wavierpercentage/:id
exports.deleteWavierpercentage = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dwavierpercentage = await WavierPercentage.findByIdAndRemove(id);

  if (!dwavierpercentage) {
    return next(new ErrorHandler("Wavierpercentage not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});