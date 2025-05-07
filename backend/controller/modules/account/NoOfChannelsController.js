const NoOfChannels = require('../../../model/modules/account/NoOfChannelsModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All NoOfChannels Name => /api/noofchannelss
exports.getAllNoOfChannels = catchAsyncErrors(async (req, res, next) => {
  let noofchannels;
  try {
    noofchannels = await NoOfChannels.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!noofchannels) {
    return next(new ErrorHandler("NoOfChannels Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    noofchannels,
  });
});

// Create new NoOfChannels=> /api/noofchannels/new
exports.addNoOfChannels = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await NoOfChannels.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("NoOfChannels Name already exist!", 400));
  }

  let anoofchannels = await NoOfChannels.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle NoOfChannels => /api/noofchannels/:id
exports.getSingleNoOfChannels = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let snoofchannels = await NoOfChannels.findById(id);

  if (!snoofchannels) {
    return next(new ErrorHandler("NoOfChannels Name not found!", 404));
  }
  return res.status(200).json({
    snoofchannels,
  });
});

// update NoOfChannels by id => /api/noofchannels/:id
exports.updateNoOfChannels = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let unoofchannels = await NoOfChannels.findByIdAndUpdate(id, req.body);
  if (!unoofchannels) {
    return next(new ErrorHandler("NoOfChannels Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete NoOfChannels by id => /api/noofchannels/:id
exports.deleteNoOfChannels = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dnoofchannels = await NoOfChannels.findByIdAndRemove(id);

  if (!dnoofchannels) {
    return next(new ErrorHandler("NoOfChannels Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
