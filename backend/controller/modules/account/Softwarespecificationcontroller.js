const Softwarespecification = require("../../../model/modules/account/SoftwareSpecificationmodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Softwarespecification Name => /api/operatingsystem
exports.getAllSoftwarespecification = catchAsyncErrors(async (req, res, next) => {
  let softwarespecification;
  try {
    softwarespecification = await Softwarespecification.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    softwarespecification,
  });
});

exports.getTypeSoftwarespecification = catchAsyncErrors(async (req, res, next) => {
  let softwarespecification;
  try {
    softwarespecification = await Softwarespecification.find({ type: req.body.type }, { name: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    softwarespecification,
  });
});


// Create new Softwarespecification=> /api/operatingsystem/new
exports.addSoftwarespecification = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Softwarespecification.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let asoftwarespecification = await Softwarespecification.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Softwarespecification => /api/operatingsystem/:id
exports.getSingleSoftwarespecification = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ssoftwarespecification = await Softwarespecification.findById(id);

  if (!ssoftwarespecification) {
    return next(new ErrorHandler("Softwarespecification Name not found!", 404));
  }
  return res.status(200).json({
    ssoftwarespecification,
  });
});

// update Softwarespecification by id => /api/operatingsystem/:id
exports.updateSoftwarespecification = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let usoftwarespecification = await Softwarespecification.findByIdAndUpdate(id, req.body);
  if (!usoftwarespecification) {
    return next(new ErrorHandler("Softwarespecification Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Softwarespecification by id => /api/operatingsystem/:id
exports.deleteSoftwarespecification = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dsoftwarespecification = await Softwarespecification.findByIdAndRemove(id);

  if (!dsoftwarespecification) {
    return next(new ErrorHandler("Softwarespecification Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
