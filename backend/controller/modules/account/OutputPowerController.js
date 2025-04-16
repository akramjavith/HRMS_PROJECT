const OutputPower = require('../../../model/modules/account/OutputPowerModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All OutputPower Name => /api/outputpowers
exports.getAllOutputPower = catchAsyncErrors(async (req, res, next) => {
  let outputpower;
  try {
    outputpower = await OutputPower.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!outputpower) {
    return next(new ErrorHandler("OutputPower Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    outputpower,
  });
});

// Create new OutputPower=> /api/outputpower/new
exports.addOutputPower = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await OutputPower.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("OutputPower Name already exist!", 400));
  }

  let aoutputpower = await OutputPower.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle OutputPower => /api/outputpower/:id
exports.getSingleOutputPower = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let soutputpower = await OutputPower.findById(id);

  if (!soutputpower) {
    return next(new ErrorHandler("OutputPower Name not found!", 404));
  }
  return res.status(200).json({
    soutputpower,
  });
});

// update OutputPower by id => /api/outputpower/:id
exports.updateOutputPower = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uoutputpower = await OutputPower.findByIdAndUpdate(id, req.body);
  if (!uoutputpower) {
    return next(new ErrorHandler("OutputPower Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete OutputPower by id => /api/outputpower/:id
exports.deleteOutputPower = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let doutputpower = await OutputPower.findByIdAndRemove(id);

  if (!doutputpower) {
    return next(new ErrorHandler("OutputPower Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
