const Experiencebase = require("../../../model/modules/production/experinencebasewavier");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Experiencebase => /api/Experiencebase
exports.getAllExperiencebase = catchAsyncErrors(async (req, res, next) => {
  let experiencebases;
  try {
    experiencebases = await Experiencebase.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!experiencebases) {
    return next(new ErrorHandler("Experiencebase not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    experiencebases,
  });
});

// Create new Experiencebase => /api/Experiencebase/new
exports.addExperiencebase = catchAsyncErrors(async (req, res, next) => {
  let aExperiencebase = await Experiencebase.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Experiencebase => /api/Experiencebase/:id
exports.getSingleExperiencebase = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sexperiencebase = await Experiencebase.findById(id);

  if (!sexperiencebase) {
    return next(new ErrorHandler("Experiencebase not found!", 404));
  }
  return res.status(200).json({
    sexperiencebase,
  });
});

// update Experiencebase by id => /api/Experiencebase/:id
exports.updateExperiencebase = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uexperiencebase = await Experiencebase.findByIdAndUpdate(id, req.body);
  if (!uexperiencebase) {
    return next(new ErrorHandler("Experiencebase not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Experiencebase by id => /api/Experiencebase/:id
exports.deleteExperiencebase = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dexperiencebase = await Experiencebase.findByIdAndRemove(id);

  if (!dexperiencebase) {
    return next(new ErrorHandler("Experiencebase not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
