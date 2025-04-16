const FrequencyMaster = require("../../../model/modules/account/frequencymastermodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All FrequencyMaster Name => /api/frequencymasters
exports.getAllFrequencyMaster = catchAsyncErrors(async (req, res, next) => {
  let freqMaster;
  try {
    freqMaster = await FrequencyMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!freqMaster) {
    return next(new ErrorHandler("FrequencyMaster Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    freqMaster,
  });
});

// Create new FrequencyMaster=> /api/frequencymaster/new
exports.addFrequencyMaster = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await FrequencyMaster.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("FrequencyMaster Name already exist!", 400));
  }

  let aproduct = await FrequencyMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle FrequencyMaster => /api/frequencymaster/:id
exports.getSingleFrequencyMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sfreqMaster = await FrequencyMaster.findById(id);

  if (!sfreqMaster) {
    return next(new ErrorHandler("FrequencyMaster Name not found!", 404));
  }
  return res.status(200).json({
    sfreqMaster,
  });
});

// update FrequencyMaster by id => /api/frequencymaster/:id
exports.updateFrequencyMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ufreqMaster = await FrequencyMaster.findByIdAndUpdate(id, req.body);
  if (!ufreqMaster) {
    return next(new ErrorHandler("FrequencyMaster Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete FrequencyMaster by id => /api/frequencymaster/:id
exports.deleteFrequencyMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dfreqMaster = await FrequencyMaster.findByIdAndRemove(id);

  if (!dfreqMaster) {
    return next(new ErrorHandler("FrequencyMaster Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
