const Designationgroup = require("../../model/modules/designationgroup");
const Designation = require("../../model/modules/designation");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const Hirerarchi = require("../../model/modules/setup/hierarchy");

// get All Designationgroup => /api/Designationgroup
exports.getAllDesiggroup = catchAsyncErrors(async (req, res, next) => {
  let desiggroup;
  try {
    desiggroup = await Designationgroup.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!desiggroup) {
    return next(new ErrorHandler("Manage not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    desiggroup,
  });
});


exports.getOverallDesignationgroupDetails = catchAsyncErrors(async (req, res, next) => {
  let designation, hierarchy;

  try {
    designation = await Designation.find({ group: req.body.oldname });
    hierarchy = await Hirerarchi.find({ designationgroup: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designation && !hierarchy) {
    return next(new ErrorHandler("Designationgroup details not found", 404));
  }
  return res.status(200).json({
    count: designation.length + hierarchy.length,
    designation,
    hierarchy,
  });
});

// Create new Designationgroup=> /api/desiggroup/new
// Create new Designationgroup=> /api/desiggroup/new
exports.adddesiggroup = catchAsyncErrors(async (req, res, next) => {
  let aproduct = await Designationgroup.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Designationgroup => /api/desiggroup/:id
exports.getSingledesiggroup = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdesiggroup = await Designationgroup.findById(id);

  if (!sdesiggroup) {
    return next(new ErrorHandler("desiggroup not found!", 404));
  }
  return res.status(200).json({
    sdesiggroup,
  });
});

// update desiggroup by id => /api/desiggroup/:id
exports.updatedesiggroup = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udesiggroup = await Designationgroup.findByIdAndUpdate(id, req.body);

  if (!udesiggroup) {
    return next(new ErrorHandler("desiggroup not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Designationgroup by id => /api/desiggroup/:id
exports.deletedesiggroup = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ddesiggroup = await Designationgroup.findByIdAndRemove(id);

  if (!ddesiggroup) {
    return next(new ErrorHandler("desiggroup not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
