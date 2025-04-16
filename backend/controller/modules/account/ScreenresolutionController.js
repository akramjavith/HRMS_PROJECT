const ScreenResolution = require("../../../model/modules/account/ScreenResolutionModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ScreenResolution Name => /api/screenresolutions
exports.getAllScreenResolution = catchAsyncErrors(async (req, res, next) => {
  let screenresolution;
  try {
    screenresolution = await ScreenResolution.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!screenresolution) {
    return next(new ErrorHandler("ScreenResolution Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    screenresolution,
  });
});

// Create new ScreenResolution=> /api/screenresolution/new
exports.addScreenResolution = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await ScreenResolution.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("ScreenResolution Name already exist!", 400));
  }

  let ascreenresolution = await ScreenResolution.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ScreenResolution => /api/screenresolution/:id
exports.getSingleScreenResolution = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sscreenresolution = await ScreenResolution.findById(id);

  if (!sscreenresolution) {
    return next(new ErrorHandler("ScreenResolution Name not found!", 404));
  }
  return res.status(200).json({
    sscreenresolution,
  });
});

// update ScreenResolution by id => /api/screenresolution/:id
exports.updateScreenResolution = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uscreenresolution = await ScreenResolution.findByIdAndUpdate(id, req.body);
  if (!uscreenresolution) {
    return next(new ErrorHandler("ScreenResolution Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ScreenResolution by id => /api/screenresolution/:id
exports.deleteScreenResolution = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dscreenresolution = await ScreenResolution.findByIdAndRemove(id);

  if (!dscreenresolution) {
    return next(new ErrorHandler("ScreenResolution Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
