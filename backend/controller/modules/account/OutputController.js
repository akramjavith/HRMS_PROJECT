const Output = require('../../../model/modules/account/OutputModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Output Name => /api/outputs
exports.getAllOutput = catchAsyncErrors(async (req, res, next) => {
  let output;
  try {
    output = await Output.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!output) {
    return next(new ErrorHandler("Output Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    output,
  });
});

// Create new Output=> /api/output/new
exports.addOutput = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Output.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Output Name already exist!", 400));
  }

  let aoutput = await Output.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Output => /api/output/:id
exports.getSingleOutput = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let soutput = await Output.findById(id);

  if (!soutput) {
    return next(new ErrorHandler("Output Name not found!", 404));
  }
  return res.status(200).json({
    soutput,
  });
});

// update Output by id => /api/output/:id
exports.updateOutput = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uoutput = await Output.findByIdAndUpdate(id, req.body);
  if (!uoutput) {
    return next(new ErrorHandler("Output Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Output by id => /api/output/:id
exports.deleteOutput = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let doutput = await Output.findByIdAndRemove(id);

  if (!doutput) {
    return next(new ErrorHandler("Output Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
