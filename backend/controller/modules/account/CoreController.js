const Core = require('../../../model/modules/account/CoreModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Core Name => /api/cores
exports.getAllCore = catchAsyncErrors(async (req, res, next) => {
  let core;
  try {
    core = await Core.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!core) {
    return next(new ErrorHandler("Core Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    core,
  });
});

// Create new Core=> /api/core/new
exports.addCore = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Core.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Core Name already exist!", 400));
  }

  let acore = await Core.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Core => /api/core/:id
exports.getSingleCore = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let score = await Core.findById(id);

  if (!score) {
    return next(new ErrorHandler("Core Name not found!", 404));
  }
  return res.status(200).json({
    score,
  });
});

// update Core by id => /api/core/:id
exports.updateCore = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucore = await Core.findByIdAndUpdate(id, req.body);
  if (!ucore) {
    return next(new ErrorHandler("Core Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Core by id => /api/core/:id
exports.deleteCore = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dcore = await Core.findByIdAndRemove(id);

  if (!dcore) {
    return next(new ErrorHandler("Core Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
