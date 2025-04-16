const ManageTypePG = require("../../../model/modules/interactors/ManagetypepurposegroupingModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ManageTypePG type Name => /api/manageTypepg
exports.getAllManageTypePG = catchAsyncErrors(async (req, res, next) => {
  let manageTypePG;
  try {
    manageTypePG = await ManageTypePG.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manageTypePG) {
    return next(new ErrorHandler("ManageTypePG type Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    manageTypePG,
  });
});

// Create new Connectivity=> /api/manageTypepg/new
exports.addManageTypePG= catchAsyncErrors(async (req, res, next) => {

  let aInteractorType = await ManageTypePG.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single interactortype => /api/manageTypepg/:id
exports.getSingleManageTypePG = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let manageTypePG = await ManageTypePG.findById(id);

  if (!manageTypePG) {
    return next(new ErrorHandler("ManageTypePG Type Name not found!", 404));
  }
  return res.status(200).json({
    manageTypePG,
  });
});

// update Interactor Type by id => /api/manageTypepg/:id
exports.updateManageTypePG = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let manageTypePG = await ManageTypePG.findByIdAndUpdate(id, req.body);
  if (!manageTypePG) {
    return next(new ErrorHandler("ManageTypePG Type Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete interactor type by id => /api/manageTypepg/:id
exports.deleteManageTypePG = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let manageTypePG = await ManageTypePG.findByIdAndRemove(id);

  if (!manageTypePG) {
    return next(new ErrorHandler("ManageTypePG Type Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
