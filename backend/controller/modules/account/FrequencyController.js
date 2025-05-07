const Frequency = require('../../../model/modules/account/FrequencyModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Frequency Name => /api/frequencys
exports.getAllFrequency = catchAsyncErrors(async (req, res, next) => {
  let frequency;
  try {
    frequency = await Frequency.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!frequency) {
    return next(new ErrorHandler("Frequency Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    frequency,
  });
});

// Create new Frequency=> /api/frequency/new
exports.addFrequency = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Frequency.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Frequency Name already exist!", 400));
  }

  let afrequency = await Frequency.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Frequency => /api/frequency/:id
exports.getSingleFrequency = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sfrequency = await Frequency.findById(id);

  if (!sfrequency) {
    return next(new ErrorHandler("Frequency Name not found!", 404));
  }
  return res.status(200).json({
    sfrequency,
  });
});

// update Frequency by id => /api/frequency/:id
exports.updateFrequency = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ufrequency = await Frequency.findByIdAndUpdate(id, req.body);
  if (!ufrequency) {
    return next(new ErrorHandler("Frequency Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Frequency by id => /api/frequency/:id
exports.deleteFrequency = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dfrequency = await Frequency.findByIdAndRemove(id);

  if (!dfrequency) {
    return next(new ErrorHandler("Frequency Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
