const Masterfieldname = require("../../../model/modules/production/masterfieldname");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Masterfieldname => /api/Masterfieldname
exports.getAllMasterfieldname = catchAsyncErrors(async (req, res, next) => {
  let masterfieldnames;
  try {
    masterfieldnames = await Masterfieldname.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!masterfieldnames) {
    return next(new ErrorHandler("Masterfieldname not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    masterfieldnames,
  });
});

// Create new Masterfieldname => /api/Masterfieldname/new
exports.addMasterfieldname = catchAsyncErrors(async (req, res, next) => {
  let aMasterfieldname = await Masterfieldname.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Masterfieldname => /api/Masterfieldname/:id
exports.getSingleMasterfieldname = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let smasterfieldname = await Masterfieldname.findById(id);

  if (!smasterfieldname) {
    return next(new ErrorHandler("Masterfieldname not found!", 404));
  }
  return res.status(200).json({
    smasterfieldname,
  });
});

// update Masterfieldname by id => /api/Masterfieldname/:id
exports.updateMasterfieldname = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let umasterfieldname = await Masterfieldname.findByIdAndUpdate(id, req.body);
  if (!umasterfieldname) {
    return next(new ErrorHandler("Masterfieldname not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Masterfieldname by id => /api/Masterfieldname/:id
exports.deleteMasterfieldname = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dmasterfieldname = await Masterfieldname.findByIdAndRemove(id);

  if (!dmasterfieldname) {
    return next(new ErrorHandler("Masterfieldname not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
