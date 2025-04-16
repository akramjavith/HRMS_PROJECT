const AssetCapacity = require("../../../model/modules/account/AssetCapacityModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetCapacity Name => /api/assetcapacitys
exports.getAllAssetCapacity = catchAsyncErrors(async (req, res, next) => {
  let assetcapacity;
  try {
    assetcapacity = await AssetCapacity.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetcapacity) {
    return next(new ErrorHandler("AssetCapacity Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assetcapacity,
  });
});

// Create new AssetCapacity=> /api/assetcapacity/new
exports.addAssetCapacity = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await AssetCapacity.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let aassetcapacity = await AssetCapacity.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetCapacity => /api/assetcapacity/:id
exports.getSingleAssetCapacity = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassetcapacity = await AssetCapacity.findById(id);

  if (!sassetcapacity) {
    return next(new ErrorHandler("AssetCapacity Name not found!", 404));
  }
  return res.status(200).json({
    sassetcapacity,
  });
});

// update AssetCapacity by id => /api/assetcapacity/:id
exports.updateAssetCapacity = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetcapacity = await AssetCapacity.findByIdAndUpdate(id, req.body);
  if (!uassetcapacity) {
    return next(new ErrorHandler("AssetCapacity Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetCapacity by id => /api/assetcapacity/:id
exports.deleteAssetCapacity = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassetcapacity = await AssetCapacity.findByIdAndRemove(id);

  if (!dassetcapacity) {
    return next(new ErrorHandler("AssetCapacity Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
