const VomMasterName = require("../../../model/modules/account/vommaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All vom master name => /api/vommasternames
exports.getAllVomMasterName = catchAsyncErrors(async (req, res, next) => {
  let vommaster;
  try {
    vommaster = await VomMasterName.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!vommaster) {
    return next(new ErrorHandler("Vom Master Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    vommaster,
  });
});

// Create new vom master name => /api/vommastername/new
exports.addVomMasterName = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await VomMasterName.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Vom Name already exist!", 400));
  }

  let aproduct = await VomMasterName.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle vom master name => /api/vommastername/:id
exports.getSingleVomMasterName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let svommaster = await VomMasterName.findById(id);

  if (!svommaster) {
    return next(new ErrorHandler("Vom Master Name not found!", 404));
  }
  return res.status(200).json({
    svommaster,
  });
});

// update vom master name by id => /api/vommastername/:id
exports.updateVomMasterName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uvommaster = await VomMasterName.findByIdAndUpdate(id, req.body);

  if (!uvommaster) {
    return next(new ErrorHandler("Vom Master Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete vom master name by id => /api/vommastername/:id
exports.deleteVomMasterName = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dvommaster = await VomMasterName.findByIdAndRemove(id);

  if (!dvommaster) {
    return next(new ErrorHandler("Vom Master Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
