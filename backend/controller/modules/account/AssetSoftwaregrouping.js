const Assertsoftwaregrouping = require("../../../model/modules/account/AssertsoftwaregroupingModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Assertsoftwaregrouping Name => /api/assertsoftwaregrouping
exports.getAllAssertsoftwaregrouping = catchAsyncErrors(async (req, res, next) => {
  let assertsoftwaregrouping;
  try {
    assertsoftwaregrouping = await Assertsoftwaregrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assertsoftwaregrouping) {
    return next(new ErrorHandler("Assertsoftwaregrouping Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assertsoftwaregrouping,
  });
});

// Create new Assertsoftwaregrouping=> /api/assertsoftwaregrouping/new
exports.addAssertsoftwaregrouping = catchAsyncErrors(async (req, res, next) => {


  let aassertsoftwaregrouping = await Assertsoftwaregrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Assertsoftwaregrouping => /api/assertsoftwaregrouping/:id
exports.getSingleAssertsoftwaregrouping= catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassertsoftwaregrouping= await Assertsoftwaregrouping.findById(id);

  if (!sassertsoftwaregrouping) {
    return next(new ErrorHandler("Assertsoftwaregrouping Name not found!", 404));
  }
  return res.status(200).json({
    sassertsoftwaregrouping,
  });
});

// update Assertsoftwaregrouping by id => /api/assertsoftwaregrouping/:id
exports.updateAssertsoftwaregrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassertsoftwaregrouping = await Assertsoftwaregrouping.findByIdAndUpdate(id, req.body);
  if (!uassertsoftwaregrouping) {
    return next(new ErrorHandler("Assertsoftwaregrouping Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Assertsoftwaregrouping by id => /api/assertsoftwaregrouping/:id
exports.deleteAssertsoftwaregrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassertsoftwaregrouping = await Assertsoftwaregrouping.findByIdAndRemove(id);

  if (!dassertsoftwaregrouping) {
    return next(new ErrorHandler("Assertsoftwaregrouping Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
