const AssetModel = require("../../../model/modules/account/AssetModelModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetModel Name => /api/assetmodels
exports.getAllAssetModel = catchAsyncErrors(async (req, res, next) => {
  let assetmodel;
  try {
    assetmodel = await AssetModel.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetmodel) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assetmodel,
  });
});

// Create new AssetModel=> /api/assetmodel/new
exports.addAssetModel = catchAsyncErrors(async (req, res, next) => {
  //   let checkloc = await AssetModel.findOne({ name: req.body.name });

  //   if (checkloc) {
  //     return next(new ErrorHandler("Name already exist!", 400));
  //   }

  let aassetmodel = await AssetModel.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetModel => /api/assetmodel/:id
exports.getSingleAssetModel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassetmodel = await AssetModel.findById(id);

  if (!sassetmodel) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({
    sassetmodel,
  });
});

// update AssetModel by id => /api/assetmodel/:id
exports.updateAssetModel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uassetmodel = await AssetModel.findByIdAndUpdate(id, req.body);
  if (!uassetmodel) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetModel by id => /api/assetmodel/:id
exports.deleteAssetModel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassetmodel = await AssetModel.findByIdAndRemove(id);

  if (!dassetmodel) {
    return next(new ErrorHandler("Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
