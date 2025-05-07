const Manageidlework = require("../../../model/modules/production/idelwork");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

// get All Manageidlework => /api/Manageidlework
exports.getAllManageidlework = catchAsyncErrors(async (req, res, next) => {
  let manageidlework;
  try {
    manageidlework = await Manageidlework.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manageidlework) {
    return next(new ErrorHandler("Managecategory not found!", 404));
  }
  return res.status(200).json({
    manageidlework,
  });
});

// Create new Manageidlework=> /api/Manageidlework/new
exports.addManageidlework = catchAsyncErrors(async (req, res, next) => {

  let aproduct = await Manageidlework.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Manageidlework => /api/Manageidlework/:id
exports.getSingleManageidlework = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let smanageidlework = await Manageidlework.findById(id);

  if (!smanageidlework) {
    return next(new ErrorHandler("Manageidlework not found!", 404));
  }
  return res.status(200).json({
    smanageidlework,
  });
});

// update Manageidlework by id => /api/Manageidlework/:id
exports.updateManageidlework = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let umanageidlework = await Manageidlework.findByIdAndUpdate(id, req.body);

  if (!umanageidlework) {
    return next(new ErrorHandler("Manageidlework not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Manageidlework by id => /api/Manageidlework/:id
exports.deleteManageidlework = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dmanageidlework = await Manageidlework.findByIdAndRemove(id);

  if (!dmanageidlework) {
    return next(new ErrorHandler("Manageidlework Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


