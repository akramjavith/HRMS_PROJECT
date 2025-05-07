const AssetSpecificationType = require("../../../model/modules/account/AssetSpecificationTypeModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetSpecificationType Name => /api/assetspecificationtypes
exports.getAllAssetSpecificationType = catchAsyncErrors(async (req, res, next) => {
  let assetspecificationtype;
  try {
    assetspecificationtype = await AssetSpecificationType.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetspecificationtype) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assetspecificationtype,
  });
});

// Create new AssetSpecificationType=> /api/assetspecificationtype/new
exports.addAssetSpecificationType = catchAsyncErrors(async (req, res, next) => {
  //   let checkloc = await AssetSpecificationType.findOne({ name: req.body.name });

  //   if (checkloc) {
  //     return next(new ErrorHandler("Name already exist!", 400));
  //   }

  let aassetspecificationtype = await AssetSpecificationType.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetSpecificationType => /api/assetspecificationtype/:id
exports.getSingleAssetSpecificationType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassetspecificationtype = await AssetSpecificationType.findById(id);

  if (!sassetspecificationtype) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    sassetspecificationtype,
  });
});

// update AssetSpecificationType by id => /api/assetspecificationtype/:id
exports.updateAssetSpecificationType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetspecificationtype = await AssetSpecificationType.findByIdAndUpdate(id, req.body);
  if (!uassetspecificationtype) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetSpecificationType by id => /api/assetspecificationtype/:id
exports.deleteAssetSpecificationType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassetspecificationtype = await AssetSpecificationType.findByIdAndRemove(id);

  if (!dassetspecificationtype) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
