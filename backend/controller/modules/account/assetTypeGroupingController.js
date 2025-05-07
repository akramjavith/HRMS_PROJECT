const AssetTypeGrouping = require("../../../model/modules/account/assetTypeGroupingModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All AssetTypeGrouping Name => /api/assettypegroupings
exports.getAllAssetTypeGrouping = catchAsyncErrors(async (req, res, next) => {
  let assettypegrouping;
  try {
    assettypegrouping = await AssetTypeGrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assettypegrouping) {
    return next(new ErrorHandler("AssetTypeGrouping Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    assettypegrouping,
  });
});

// Create new AssetTypeGrouping=> /api/assettypegrouping/new
exports.addAssetTypeGrouping = catchAsyncErrors(async (req, res, next) => {
  // let checkloc = await AssetTypeGrouping.findOne({ name: req.body.name });

  // if (checkloc) {
  //     return next(new ErrorHandler('AssetTypeGrouping Name already exist!', 400));
  // }

  let aassettypegrouping = await AssetTypeGrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle AssetTypeGrouping => /api/assettypegrouping/:id
exports.getSingleAssetTypeGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassettypegrouping = await AssetTypeGrouping.findById(id);

  if (!sassettypegrouping) {
    return next(new ErrorHandler("AssetTypeGrouping Name not found!", 404));
  }
  return res.status(200).json({
    sassettypegrouping,
  });
});

// update AssetTypeGrouping by id => /api/assettypegrouping/:id
exports.updateAssetTypeGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let assettypegrouping = await AssetTypeGrouping.findByIdAndUpdate(id, req.body);
  if (!assettypegrouping) {
    return next(new ErrorHandler("AssetTypeGrouping Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete AssetTypeGrouping by id => /api/assettypegrouping/:id
exports.deleteAssetTypeGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassettypegrouping = await AssetTypeGrouping.findByIdAndRemove(id);

  if (!dassettypegrouping) {
    return next(new ErrorHandler("AssetTypeGrouping Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
