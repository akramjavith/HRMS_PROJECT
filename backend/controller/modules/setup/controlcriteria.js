const Controlcriteria = require("../../../model/modules/setup/controlcriteria");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Controlcriteria =>/api/Controlcriteria
exports.getAllControlcriteria = catchAsyncErrors(async (req, res, next) => {
  let controlcriterias;
  try {
    controlcriterias = await Controlcriteria.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!controlcriterias) {
    return next(new ErrorHandler("Controlcriteria not found!", 404));
  }
  return res.status(200).json({
    controlcriterias,
  });
});

//create new Controlcriteria => /api/Controlcriteria/new
exports.addControlcriteria = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aControlcriteria = await Controlcriteria.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Controlcriteria => /api/Controlcriteria/:id
exports.getSingleControlcriteria = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let scontrolcriteria = await Controlcriteria.findById(id);
  if (!scontrolcriteria) {
    return next(new ErrorHandler("Controlcriteria not found", 404));
  }
  return res.status(200).json({
    scontrolcriteria,
  });
});

//update Controlcriteria by id => /api/Controlcriteria/:id
exports.updateControlcriteria = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucontrolcriteria = await Controlcriteria.findByIdAndUpdate(id, req.body);
  if (!ucontrolcriteria) {
    return next(new ErrorHandler("Controlcriteria not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Controlcriteria by id => /api/Controlcriteria/:id
exports.deleteControlcriteria = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dcontrolcriteria = await Controlcriteria.findByIdAndRemove(id);
  if (!dcontrolcriteria) {
    return next(new ErrorHandler("Controlcriteria not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
