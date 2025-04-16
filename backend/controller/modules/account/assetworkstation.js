const AssetWorkstation = require("../../../model/modules/account/assetworkstation");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get all ticketscategory => /api/documencategories

exports.getAllAssetWorkstation = catchAsyncErrors(async (req, res, next) => {
  let assetworkstation;
  try {
    assetworkstation = await AssetWorkstation.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetworkstation) {
    return next(new ErrorHandler("category not found", 404));
  }
  // Add serial numbers to the assetworkstation
  const alldoccategory = assetworkstation.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    assetworkstation: alldoccategory,
  });
});


exports.getAllAssetWorkstationLimitedByWorkstaion = catchAsyncErrors(async (req, res, next) => {
  let assetworkstation;
  try {
    assetworkstation = await AssetWorkstation.find(
      { workstation: req.body.workstation }, { categoryname: 1 }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assetworkstation) {
    return next(new ErrorHandler("category not found", 404));
  }

  return res.status(200).json({
    assetworkstation
  });
});






exports.addAssetWorkstation = catchAsyncErrors(async (req, res, next) => {
  await AssetWorkstation.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

exports.getSingleAssetWorkstation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sassetworkstation = await AssetWorkstation.findById(id);
  if (!sassetworkstation) {
    return next(new ErrorHandler("tickets not found"));
  }
  return res.status(200).json({
    sassetworkstation,
  });
});

exports.updateAssetWorkstation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uassetworkstation = await AssetWorkstation.findByIdAndUpdate(id, req.body);

  if (!uassetworkstation) {
    return next(new ErrorHandler("ticket not found"));
  }
  return res.status(200).json({
    message: "Update Successfully",
    uassetworkstation,
  });
});

//delete assetworkstation by id => /api/delticketcateg/:id
exports.deleteAssetWorkstation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dassetworkstation = await AssetWorkstation.findByIdAndRemove(id);
  if (!dassetworkstation) {
    return next(new ErrorHandler("ticket not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
