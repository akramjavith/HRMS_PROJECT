const VendorEB = require("../../../model/modules/eb/vendormaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// Create new VendorEB=> /api/vendormasterforeb/new
exports.addVendorEB = catchAsyncErrors(async (req, res, next) => {
  let addVendorEB = await VendorEB.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get All VendorEB => /api/allvendormasterforeb
exports.getAllVendorEB = catchAsyncErrors(async (req, res, next) => {
  let vendoreb;
  try {
    vendoreb = await VendorEB.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!vendoreb) {
    return next(new ErrorHandler("vendorEB not found!", 404));
  }
  return res.status(200).json({
    vendoreb,
  });
});

// get Single VendorEB => /api/singlevendormasterforeb/:id
exports.getSingleVendorEB = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let svendoreb = await VendorEB.findById(id);

  if (!svendoreb) {
    return next(new ErrorHandler("VendorEB not found!", 404));
  }
  return res.status(200).json({
    svendoreb,
  });
});

// update VendorEB by id => /api/singlevendormasterforeb/:id
exports.updateVendorEB = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uvendoreb = await VendorEB.findByIdAndUpdate(id, req.body);

  if (!uvendoreb) {
    return next(new ErrorHandler("VendorEB not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete VendorEB by id => /api/singlevendormasterforeb/:id
exports.deleteVendorEB = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dvendoreb = await VendorEB.findByIdAndRemove(id);

  if (!dvendoreb) {
    return next(new ErrorHandler("VendorEB not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});