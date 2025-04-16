const NonProductionunitAllot = require("../../../../model/modules/production/nonproduction/NonProductionunitallotModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");
const moment = require("moment");

// get All NonProductionunitAllot => /api/NonProductionunitAllot
exports.getAllNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  let nonproductionunitallot;
  try {
    nonproductionunitallot = await NonProductionunitAllot.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot not found!", 404));
  }
  return res.status(200).json({
    nonproductionunitallot,
  });
});

// Create new NonProductionunitAllot=> /api/NonProductionunitAllot/new
exports.addNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {

  let aproduct = await NonProductionunitAllot.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle NonProductionunitAllot => /api/NonProductionunitAllot/:id
exports.getSingleNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let nonproductionunitallot = await NonProductionunitAllot.findById(id);

  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot not found!", 404));
  }
  return res.status(200).json({
    nonproductionunitallot,
  });
});

// update NonProductionunitAllot by id => /api/NonProductionunitAllot/:id
exports.updateNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let nonproductionunitallot = await NonProductionunitAllot.findByIdAndUpdate(id, req.body);

  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete NonProductionunitAllot by id => /api/NonProductionunitAllot/:id
exports.deleteNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let nonproductionunitallot = await NonProductionunitAllot.findByIdAndRemove(id);

  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


