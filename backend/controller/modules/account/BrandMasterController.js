const BrandMaster = require("../../../model/modules/account/BrandMasterModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All BrandMaster Name => /api/brandmasters
exports.getAllBrandMaster = catchAsyncErrors(async (req, res, next) => {
  let brandmaster;
  try {
    brandmaster = await BrandMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!brandmaster) {
    return next(new ErrorHandler("Brand Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    brandmaster,
  });
});

// Create new BrandMaster=> /api/brandmaster/new
exports.addBrandMaster = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await BrandMaster.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Brand Name already exist!", 400));
  }

  let abrandmaster = await BrandMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle BrandMaster => /api/brandmaster/:id
exports.getSingleBrandMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sbrandmaster = await BrandMaster.findById(id);

  if (!sbrandmaster) {
    return next(new ErrorHandler("Brand Name not found!", 404));
  }
  return res.status(200).json({
    sbrandmaster,
  });
});

// update BrandMaster by id => /api/brandmaster/:id
exports.updateBrandMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ubrandmaster = await BrandMaster.findByIdAndUpdate(id, req.body);
  if (!ubrandmaster) {
    return next(new ErrorHandler("Brand Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete BrandMaster by id => /api/brandmaster/:id
exports.deleteBrandMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dbrandmaster = await BrandMaster.findByIdAndRemove(id);

  if (!dbrandmaster) {
    return next(new ErrorHandler("Brand Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
