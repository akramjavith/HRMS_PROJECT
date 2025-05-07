const VendorGrouping = require("../../../model/modules/account/vendorgrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// Create new VendorGrouping=> /api/vendorgrouping/new
exports.addVendorGrouping = catchAsyncErrors(async (req, res, next) => {
  let addVendorgrouping = await VendorGrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get All VendorGrouping => /api/vendorgrouping
exports.getAllVendorGrouping = catchAsyncErrors(async (req, res, next) => {
  let vendorgrouping;
  try {
    vendorgrouping = await VendorGrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!vendorgrouping) {
    return next(new ErrorHandler("vendor Grouping not found!", 404));
  }
  return res.status(200).json({
    vendorgrouping,
  });
});

// get Single VendorGrouping => /api/singlevendorgrouping/:id
exports.getSinglevendorGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let svendorgrouping = await VendorGrouping.findById(id);

  if (!svendorgrouping) {
    return next(new ErrorHandler("Vendor Grouping not found!", 404));
  }
  return res.status(200).json({
    svendorgrouping,
  });
});

// update VendorGrouping by id => /api/singlevendorgrouping/:id
exports.updatevendorGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uvendorgrouping = await VendorGrouping.findByIdAndUpdate(id, req.body);

  if (!uvendorgrouping) {
    return next(new ErrorHandler("Vendor Grouping not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Vendordetail by id => /api/singlevendorgrouping/:id
exports.deletevendorGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dvendorgrouping = await VendorGrouping.findByIdAndRemove(id);

  if (!dvendorgrouping) {
    return next(new ErrorHandler("Vendor Grouping not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});