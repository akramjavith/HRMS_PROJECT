const AssetVariant = require("../../../model/modules/account/AssetVariantModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetVariant Name => /api/assetvariants
exports.getAllAssetVariant = catchAsyncErrors(async (req, res, next) => {
  let assetvariant;
  try {
    assetvariant = await AssetVariant.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetvariant) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assetvariant,
  });
});

// Create new AssetVariant=> /api/assetvariant/new
exports.addAssetVariant = catchAsyncErrors(async (req, res, next) => {
  //   let checkloc = await AssetVariant.findOne({ name: req.body.name });

  //   if (checkloc) {
  //     return next(new ErrorHandler("Name already exist!", 400));
  //   }

  let aassetvariant = await AssetVariant.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetVariant => /api/assetvariant/:id
exports.getSingleAssetVariant = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassetvariant = await AssetVariant.findById(id);

  if (!sassetvariant) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    sassetvariant,
  });
});

// update AssetVariant by id => /api/assetvariant/:id
exports.updateAssetVariant = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetvariant = await AssetVariant.findByIdAndUpdate(id, req.body);
  if (!uassetvariant) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetVariant by id => /api/assetvariant/:id
exports.deleteAssetVariant = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassetvariant = await AssetVariant.findByIdAndRemove(id);

  if (!dassetvariant) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
