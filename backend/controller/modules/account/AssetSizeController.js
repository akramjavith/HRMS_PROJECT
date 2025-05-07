const AssetSize = require("../../../model/modules/account/AssetSizeModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetSize Name => /api/assetsizes
exports.getAllAssetSize = catchAsyncErrors(async (req, res, next) => {
  let assetsize;
  try {
    assetsize = await AssetSize.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetsize) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assetsize,
  });
});

// Create new AssetSize=> /api/assetsize/new
exports.addAssetSize = catchAsyncErrors(async (req, res, next) => {
  //   let checkloc = await AssetSize.findOne({ name: req.body.name });

  //   if (checkloc) {
  //     return next(new ErrorHandler("Name already exist!", 400));
  //   }

  let aassetsize = await AssetSize.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetSize => /api/assetsize/:id
exports.getSingleAssetSize = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassetsize = await AssetSize.findById(id);

  if (!sassetsize) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    sassetsize,
  });
});

// update AssetSize by id => /api/assetsize/:id
exports.updateAssetSize = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetsize = await AssetSize.findByIdAndUpdate(id, req.body);
  if (!uassetsize) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetSize by id => /api/assetsize/:id
exports.deleteAssetSize = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassetsize = await AssetSize.findByIdAndRemove(id);

  if (!dassetsize) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
