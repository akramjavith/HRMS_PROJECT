const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const MyCreation = require("../../../model/modules/settings/mycreation");

// Get all MyCreation  => /api/allmycreation
exports.getAllMyCreation = catchAsyncErrors(async (req, res, next) => {
  let mycreation;
  try {
    mycreation = await MyCreation.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!mycreation) {
    return next(new ErrorHandler("Data not found", 404));
  }
  return res.status(200).json({
    count: mycreation.length,
    mycreation,
  });
});

// Create MyCreation  => /api/createmycreation
exports.createMyCreation = catchAsyncErrors(async (req, res, next) => {
  await MyCreation.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

// get single MyCreation =>/api/singlemycreation/:id
exports.getSingleMyCreation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let smycreation = await MyCreation.findById(id);
  if (!smycreation) {
    return next(new ErrorHandler("Id not found"));
  }
  return res.status(200).json({
    smycreation,
  });
});

// update MyCreation to all users => /api/singlemycreation/:id
exports.updateMyCreation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let umycreation = await MyCreation.findByIdAndUpdate(id, req.body);

  if (!umycreation) {
    return next(new ErrorHandler("Id not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

//delete
exports.deleteMyCreation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dmycreation = await MyCreation.findByIdAndRemove(id);
  if (!dmycreation) {
    return next(new ErrorHandler("Data not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
