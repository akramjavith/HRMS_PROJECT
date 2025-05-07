const Length = require('../../../model/modules/account/LengthModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Length Name => /api/lengths
exports.getAllLength = catchAsyncErrors(async (req, res, next) => {
  let lengthname;
  try {
    lengthname = await Length.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!lengthname) {
    return next(new ErrorHandler("Length Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    lengthname,
  });
});

// Create new Length=> /api/length/new
exports.addLength = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Length.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Length Name already exist!", 400));
  }

  let alengthname = await Length.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Length => /api/length/:id
exports.getSingleLength = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let slengthname = await Length.findById(id);

  if (!slengthname) {
    return next(new ErrorHandler("Length Name not found!", 404));
  }
  return res.status(200).json({
    slengthname,
  });
});

// update Length by id => /api/length/:id
exports.updateLength = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ulengthname = await Length.findByIdAndUpdate(id, req.body);
  if (!ulengthname) {
    return next(new ErrorHandler("Length Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Length by id => /api/length/:id
exports.deleteLength = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dlengthname = await Length.findByIdAndRemove(id);

  if (!dlengthname) {
    return next(new ErrorHandler("Length Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
