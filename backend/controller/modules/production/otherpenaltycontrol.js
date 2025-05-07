const Otherpenaltycontrol = require("../../../model/modules/production/otherpenaltycontrol");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Otherpenaltycontrol => /api/Otherpenaltycontrol
exports.getAllOtherpenaltycontrol = catchAsyncErrors(async (req, res, next) => {
  let otherpenaltycontrols;
  try {
    otherpenaltycontrols = await Otherpenaltycontrol.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!otherpenaltycontrols) {
    return next(new ErrorHandler("Otherpenaltycontrol not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    otherpenaltycontrols,
  });
});

// Create new Otherpenaltycontrol => /api/Otherpenaltycontrol/new
exports.addOtherpenaltycontrol = catchAsyncErrors(async (req, res, next) => {
  let aOtherpenaltycontrol = await Otherpenaltycontrol.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Otherpenaltycontrol => /api/Otherpenaltycontrol/:id
exports.getSingleOtherpenaltycontrol = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sotherpenaltycontrol = await Otherpenaltycontrol.findById(id);

  if (!sotherpenaltycontrol) {
    return next(new ErrorHandler("Experiencebase not found!", 404));
  }
  return res.status(200).json({
    sotherpenaltycontrol,
  });
});

// update Otherpenaltycontrol by id => /api/Otherpenaltycontrol/:id
exports.updateOtherpenaltycontrol = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uotherpenaltycontrol = await Otherpenaltycontrol.findByIdAndUpdate(id, req.body);
  if (!uotherpenaltycontrol) {
    return next(new ErrorHandler("Otherpenaltycontrol not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Otherpenaltycontrol by id => /api/Otherpenaltycontrol/:id
exports.deleteOtherpenaltycontrol = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dotherpenaltycontrol = await Otherpenaltycontrol.findByIdAndRemove(id);

  if (!dotherpenaltycontrol) {
    return next(new ErrorHandler("Otherpenaltycontrol not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
