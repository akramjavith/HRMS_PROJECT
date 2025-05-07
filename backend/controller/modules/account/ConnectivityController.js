const Connectivity = require("../../../model/modules/account/ConnectivityModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Connectivity Name => /api/connectivitys
exports.getAllConnectivity = catchAsyncErrors(async (req, res, next) => {
  let connectivity;
  try {
    connectivity = await Connectivity.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!connectivity) {
    return next(new ErrorHandler("Connectivity Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    connectivity,
  });
});

// Create new Connectivity=> /api/connectivity/new
exports.addConnectivity = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Connectivity.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Connectivity Name already exist!", 400));
  }

  let aconnectivity = await Connectivity.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Connectivity => /api/connectivity/:id
exports.getSingleConnectivity = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sconnectivity = await Connectivity.findById(id);

  if (!sconnectivity) {
    return next(new ErrorHandler("Connectivity Name not found!", 404));
  }
  return res.status(200).json({
    sconnectivity,
  });
});

// update Connectivity by id => /api/connectivity/:id
exports.updateConnectivity = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uconnectivity = await Connectivity.findByIdAndUpdate(id, req.body);
  if (!uconnectivity) {
    return next(new ErrorHandler("Connectivity Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Connectivity by id => /api/connectivity/:id
exports.deleteConnectivity = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dconnectivity = await Connectivity.findByIdAndRemove(id);

  if (!dconnectivity) {
    return next(new ErrorHandler("Connectivity Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
