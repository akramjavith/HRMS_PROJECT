const PenaltyClientAmountUpload = require("../../../model/modules/production/penaltyclienterrorupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const { ObjectId } = require("mongodb");

// get All PenaltyClientAmountUpload Name => /api/Penaltyclientamountupload
exports.getAllPenaltyClientAmountUpload = catchAsyncErrors(async (req, res, next) => {
  let penaltyclientamountupload;
  try {
    penaltyclientamountupload = await PenaltyClientAmountUpload.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltyclientamountupload) {
    return next(new ErrorHandler("Penaltyclientamountupload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    penaltyclientamountupload,
  });
});

// Create new PenaltyClientAmountUpload=> /api/Penaltyclientamountupload/new
exports.addPenaltyClientAmountUpload = catchAsyncErrors(async (req, res, next) => {
  let penaltyclientamountupload = await PenaltyClientAmountUpload.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle PenaltyClientAmountUpload => /api/Penaltyclientamountupload/:id
exports.getSinglePenaltyClientAmountUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spenaltyclientamountupload = await PenaltyClientAmountUpload.findById(id);

  if (!spenaltyclientamountupload) {
    return next(new ErrorHandler("Penaltyclientamountupload not found!", 404));
  }
  return res.status(200).json({
    spenaltyclientamountupload,
  });
});

// update PenaltyClientAmountUpload by id => /api/Penaltyclientamountupload/:id
exports.updatePenaltyClientAmountUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upenaltyclientamountupload = await PenaltyClientAmountUpload.findByIdAndUpdate(id, req.body);
  if (!upenaltyclientamountupload) {
    return next(new ErrorHandler("Penaltyclientamountupload not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

exports.updatePenaltyClientAmountSingleUpload = catchAsyncErrors(
  async (req, res, next) => {
    const subid = req.params.id;
    req.body.id = subid;
    try {
      const uploaddata = await PenaltyClientAmountUpload.findOneAndUpdate(
        { "uploaddata._id": subid },
        { $set: { "uploaddata.$": req.body } },
        { new: true }
      );

      if (uploaddata) {
        return res.status(200).json({ message: "Updated successfully" });
      } else {
        return next(new ErrorHandler("Something went wrong", 500));
      }
    } catch (err) {
      return next(new ErrorHandler("Internal Server Error", 500)); // Handle internal server error
    }
  }
);

// delete PenaltyClientAmountUpload by id => /api/Penaltyclientamountupload/:id
exports.deletePenaltyClientAmountUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpenaltyclientamountupload = await PenaltyClientAmountUpload.findByIdAndRemove(id);

  if (!dpenaltyclientamountupload) {
    return next(new ErrorHandler("Penaltyclientamountupload not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
