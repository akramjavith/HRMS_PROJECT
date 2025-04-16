const AssetTypeMaster = require("../../../model/modules/account/assetTypeModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetTypeMaster Name => /api/assettypemasters
exports.getAllAssetTypeMaster = catchAsyncErrors(async (req, res, next) => {
  let assettypemaster;
  try {
    assettypemaster = await AssetTypeMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assettypemaster) {
    return next(new ErrorHandler("AssetTypeMaster Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assettypemaster,
  });
});

// Create new AssetTypeMaster=> /api/assettypemaster/new
exports.addAssetTypeMaster = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await AssetTypeMaster.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Name already exist!", 400));
  }

  let aassettypemaster = await AssetTypeMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetTypeMaster => /api/assettypemaster/:id
exports.getSingleAssetTypeMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassettypemaster = await AssetTypeMaster.findById(id);

  if (!sassettypemaster) {
    return next(new ErrorHandler("AssetTypeMaster Name not found!", 404));
  }
  return res.status(200).json({
    sassettypemaster,
  });
});

// update AssetTypeMaster by id => /api/assettypemaster/:id
exports.updateAssetTypeMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sassettypemaster = await AssetTypeMaster.findByIdAndUpdate(id, req.body);
  if (!sassettypemaster) {
    return next(new ErrorHandler("AssetTypeMaster Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetTypeMaster by id => /api/assettypemaster/:id
exports.deleteAssetTypeMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassettypemaster = await AssetTypeMaster.findByIdAndRemove(id);

  if (!sassettypemaster) {
    return next(new ErrorHandler("AssetTypeMaster Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
