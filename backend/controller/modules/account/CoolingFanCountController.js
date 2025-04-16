const CoolingFanCount = require('../../../model/modules/account/CoolingFanCountModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All CoolingFanCount Name => /api/coolingfancounts
exports.getAllCoolingFanCount = catchAsyncErrors(async (req, res, next) => {
  let coolingfancount;
  try {
    coolingfancount = await CoolingFanCount.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!coolingfancount) {
    return next(new ErrorHandler("CoolingFanCount Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    coolingfancount,
  });
});

// Create new CoolingFanCount=> /api/coolingfancount/new
exports.addCoolingFanCount = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await CoolingFanCount.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("CoolingFanCount Name already exist!", 400));
  }

  let acoolingfancount = await CoolingFanCount.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle CoolingFanCount => /api/coolingfancount/:id
exports.getSingleCoolingFanCount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let scoolingfancount = await CoolingFanCount.findById(id);

  if (!scoolingfancount) {
    return next(new ErrorHandler("CoolingFanCount Name not found!", 404));
  }
  return res.status(200).json({
    scoolingfancount,
  });
});

// update CoolingFanCount by id => /api/coolingfancount/:id
exports.updateCoolingFanCount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucoolingfancount = await CoolingFanCount.findByIdAndUpdate(id, req.body);
  if (!ucoolingfancount) {
    return next(new ErrorHandler("CoolingFanCount Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete CoolingFanCount by id => /api/coolingfancount/:id
exports.deleteCoolingFanCount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dcoolingfancount = await CoolingFanCount.findByIdAndRemove(id);

  if (!dcoolingfancount) {
    return next(new ErrorHandler("CoolingFanCount Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
