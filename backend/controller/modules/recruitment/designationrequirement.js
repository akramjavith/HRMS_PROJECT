const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Designationrequirements = require("../../../model/modules/recruitment/designationrequirement")
const JobOpenings = require('../../../model/modules/recruitment/jobopenings');
// add DesignationRequirements
exports.adddesignationrequirement = catchAsyncErrors(async (req, res, next) => {
    let aproduct = await Designationrequirements.create(req.body);
    return res.status(200).json({
      message: "Successfully added!",
    });
  });

// get All Designationrequirements => /api/Designationrequirements
exports.getAllDesignationRequirement = catchAsyncErrors(async (req, res, next) => {
    let designationreq;
    try {
      designationreq = await Designationrequirements.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!designationreq) {
      return next(new ErrorHandler("Designation not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      designationreq,
    });
  });

  // get All Designationrequirements => /api/Designationrequirements
exports.getJobOpeningsDesignation = catchAsyncErrors(async (req, res, next) => {
  let designationjobs;
  try {
    designationjobs = await JobOpenings.find({designation: req.body.designation});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designationjobs) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({
    designationjobs,
  });
});

  // get All Designationrequirements => /api/Designationrequirements
exports.getDesignationManpowerFilter = catchAsyncErrors(async (req, res, next) => {
  let individualdesignation;
  try {
    individualdesignation = await Designationrequirements.find({designation: req.body.designation});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!individualdesignation) {
    return next(new ErrorHandler("Designation not found!", 404));
  }
  return res.status(200).json({
    individualdesignation,
  });
});

  // get Signle Designationrequirements => /api/desiggroup/:id
  exports.getSingledesignationRequirement = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sdesiggroupreq = await Designationrequirements.findById(id);
    if (!sdesiggroupreq) {
      return next(new ErrorHandler("Designation not found!", 404));
    }
    return res.status(200).json({
      sdesiggroupreq,
    });
  })

  // update Designationrequirements by id => /api/Designationrequirement/:id
exports.updatedesignationrequirement = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let udesignationreq = await Designationrequirements.findByIdAndUpdate(id, req.body);
    if (!udesignationreq) {
      return next(new ErrorHandler("Designation not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  });


// delete Designationrequirements by id => /api/Designationrequirement/:id
  exports.deletedesignationrequirement = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ddesignationreq = await Designationrequirements.findByIdAndRemove(id);
    if (!ddesignationreq) {
      return next(new ErrorHandler("Designation not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully", _id: req.params.id });
  });