const Operatingsystem = require("../../../model/modules/account/Operatingssystemmodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Operatingsystem Name => /api/operatingsystem
exports.getAllOperatingsystem = catchAsyncErrors(async (req, res, next) => {
  let operatingsystem;
  try {
    operatingsystem = await Operatingsystem.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!operatingsystem) {
    return next(new ErrorHandler("Operatingsystem Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    operatingsystem,
  });
});

// Create new Operatingsystem=> /api/operatingsystem/new
exports.addOperatingsystem = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Operatingsystem.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let aoperatingsystem = await Operatingsystem.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Operatingsystem => /api/operatingsystem/:id
exports.getSingleOperatingsystem = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let soperatingsystem = await Operatingsystem.findById(id);

  if (!soperatingsystem) {
    return next(new ErrorHandler("Operatingsystem Name not found!", 404));
  }
  return res.status(200).json({
    soperatingsystem,
  });
});

// update Operatingsystem by id => /api/operatingsystem/:id
exports.updateOperatingsystem = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uoperatingsystem = await Operatingsystem.findByIdAndUpdate(id, req.body);
  if (!uoperatingsystem) {
    return next(new ErrorHandler("Operatingsystem Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Operatingsystem by id => /api/operatingsystem/:id
exports.deleteOperatingsystem = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let doperatingsystem = await Operatingsystem.findByIdAndRemove(id);

  if (!doperatingsystem) {
    return next(new ErrorHandler("Operatingsystem Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
