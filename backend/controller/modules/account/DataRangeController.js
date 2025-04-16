const DataRange = require('../../../model/modules/account/DataRangeModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All DataRange Name => /api/dataranges
exports.getAllDataRange = catchAsyncErrors(async (req, res, next) => {
  let datarange;
  try {
    datarange = await DataRange.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!datarange) {
    return next(new ErrorHandler("DataRange Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    datarange,
  });
});

// Create new DataRange=> /api/datarange/new
exports.addDataRange = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await DataRange.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("DataRange Name already exist!", 400));
  }

  let adatarange = await DataRange.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle DataRange => /api/datarange/:id
exports.getSingleDataRange = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdatarange = await DataRange.findById(id);

  if (!sdatarange) {
    return next(new ErrorHandler("DataRange Name not found!", 404));
  }
  return res.status(200).json({
    sdatarange,
  });
});

// update DataRange by id => /api/datarange/:id
exports.updateDataRange = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let udatarange = await DataRange.findByIdAndUpdate(id, req.body);
  if (!udatarange) {
    return next(new ErrorHandler("DataRange Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete DataRange by id => /api/datarange/:id
exports.deleteDataRange = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ddatarange = await DataRange.findByIdAndRemove(id);

  if (!ddatarange) {
    return next(new ErrorHandler("DataRange Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
