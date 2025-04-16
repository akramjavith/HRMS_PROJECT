const AssetSpecificationGrouping = require("../../../model/modules/account/assetspecificationgrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetSpecificationGrouping Name => /api/assetspecificationgroupings
exports.getAllAssetSpecificationGrping = catchAsyncErrors(async (req, res, next) => {
  let assetspecificationgrouping;
  try {
    assetspecificationgrouping = await AssetSpecificationGrouping.find();
    // console.log(assetspecificationgrouping[0], "iii")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetspecificationgrouping) {
    return next(new ErrorHandler("AssetSpecificationGrouping not found!", 404));
  }
  return res.status(200).json({
    assetspecificationgrouping,
  });
});

// Create new AssetSpecificationGrouping=> /api/assetspecificationgrouping/new
exports.addAssetSpecificationGrping = catchAsyncErrors(async (req, res, next) => {

  let aassetspecificationgrouping = await AssetSpecificationGrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetSpecificationGrouping => /api/assetspecificationgrouping/:id
exports.getSingleAssetSpecificationGrping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassetspecificationgrouping = await AssetSpecificationGrouping.findById(id);

  if (!sassetspecificationgrouping) {
    return next(new ErrorHandler("AssetSpecificationGrouping not found!", 404));
  }
  return res.status(200).json({
    sassetspecificationgrouping,
  });
});

// update AssetSpecificationGrouping by id => /api/assetspecificationgrouping/:id
exports.updateAssetSpecificationGrping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetspecificationgrouping = await AssetSpecificationGrouping.findByIdAndUpdate(id, req.body);
  if (!uassetspecificationgrouping) {
    return next(new ErrorHandler("AssetSpecificationGrouping not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetSpecificationGrouping by id => /api/assetspecificationgrouping/:id
exports.deleteAssetSpecificationGrping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassetspecificationgrouping = await AssetSpecificationGrouping.findByIdAndRemove(id);

  if (!dassetspecificationgrouping) {
    return next(new ErrorHandler("AssetSpecificationGrouping not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
