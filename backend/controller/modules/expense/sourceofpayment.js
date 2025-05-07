const SourceofPayment = require("../../../model/modules/expense/sourceofpayment")
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All SourceofPayment type Name => /api/SourceofPayment
exports.getAllSourceofPy = catchAsyncErrors(async (req, res, next) => {
  let SourceofPy;
  try {
    SourceofPy = await SourceofPayment.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!SourceofPy) {
    return next(new ErrorHandler("SourceofPayment type Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    SourceofPy,
  });
});

// Create new Connectivity=> /api/manageTypepg/new
exports.addSourceofPy = catchAsyncErrors(async (req, res, next) => {

  let SourceofPy = await SourceofPayment.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single interactortype => /api/manageTypepg/:id
exports.getSingleSourceofPy = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let SourceofPy = await SourceofPayment.findById(id);

  if (!SourceofPy) {
    return next(new ErrorHandler("SourceofPayment Type Name not found!", 404));
  }
  return res.status(200).json({
    SourceofPy,
  });
});

// update Interactor Type by id => /api/manageTypepg/:id
exports.updateSourceofPy = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let SourceofPy = await SourceofPayment.findByIdAndUpdate(id, req.body);
  if (!SourceofPy) {
    return next(new ErrorHandler("SourceofPayment Type Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete interactor type by id => /api/manageTypepg/:id
exports.deleteSourceofPy = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let SourceofPy = await SourceofPayment.findByIdAndRemove(id);

  if (!SourceofPy) {
    return next(new ErrorHandler("SourceofPayment Type Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
