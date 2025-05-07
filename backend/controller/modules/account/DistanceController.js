const Distance = require('../../../model/modules/account/DistanceModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Distance Name => /api/distances
exports.getAllDistance = catchAsyncErrors(async (req, res, next) => {
  let distance;
  try {
    distance = await Distance.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!distance) {
    return next(new ErrorHandler("Distance Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    distance,
  });
});

// Create new Distance=> /api/distance/new
exports.addDistance = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Distance.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Distance Name already exist!", 400));
  }

  let adistance = await Distance.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Distance => /api/distance/:id
exports.getSingleDistance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdistance = await Distance.findById(id);

  if (!sdistance) {
    return next(new ErrorHandler("Distance Name not found!", 404));
  }
  return res.status(200).json({
    sdistance,
  });
});

// update Distance by id => /api/distance/:id
exports.updateDistance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let udistance = await Distance.findByIdAndUpdate(id, req.body);
  if (!udistance) {
    return next(new ErrorHandler("Distance Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Distance by id => /api/distance/:id
exports.deleteDistance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ddistance = await Distance.findByIdAndRemove(id);

  if (!ddistance) {
    return next(new ErrorHandler("Distance Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
