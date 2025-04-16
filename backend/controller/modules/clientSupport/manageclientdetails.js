const ClientDetails = require("../../../model/modules/clientSupport/manageclientdetails");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ClientDetails Name => /api/clientdetailss
exports.getAllClientDetails = catchAsyncErrors(async (req, res, next) => {
  let clientdetails;
  try {
    clientdetails = await ClientDetails.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!clientdetails) {
    return next(new ErrorHandler("ClientDetails not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    clientdetails,
  });
});

// Create new ClientDetails=> /api/clientdetails/new
exports.addClientDetails = catchAsyncErrors(async (req, res, next) => {
  console.log("manageC");

  let aclientdetails = await ClientDetails.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ClientDetails => /api/clientdetails/:id
exports.getSingleClientDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sclientdetails = await ClientDetails.findById(id);

  if (!sclientdetails) {
    return next(new ErrorHandler("ClientDetails Name not found!", 404));
  }
  return res.status(200).json({
    sclientdetails,
  });
});

// update ClientDetails by id => /api/clientdetails/:id
exports.updateClientDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uclientdetails = await ClientDetails.findByIdAndUpdate(id, req.body);
  if (!uclientdetails) {
    return next(new ErrorHandler("ClientDetails Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ClientDetails by id => /api/clientdetails/:id
exports.deleteClientDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dclientdetails = await ClientDetails.findByIdAndRemove(id);

  if (!dclientdetails) {
    return next(new ErrorHandler("ClientDetails Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
