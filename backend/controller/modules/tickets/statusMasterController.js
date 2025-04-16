const StatusMaster = require("../../../model/modules/tickets/statusMasterModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All StatusMaster Name => /api/statusmasters
exports.getAllStatusMaster = catchAsyncErrors(async (req, res, next) => {
  let statusMaster;
  try {
    statusMaster = await StatusMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!statusMaster) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    statusMaster,
  });
});

// Create new StatusMaster=> /api/statusmaster/new
exports.addStatusMaster = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await StatusMaster.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Status Master Name already exist!", 400));
  }

  let aproduct = await StatusMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle StatusMaster => /api/statusmaster/:id
exports.getSingleStatusMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sstatusMaster = await StatusMaster.findById(id);

  if (!sstatusMaster) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({
    sstatusMaster,
  });
});

// update StatusMaster by id => /api/statusmaster/:id
exports.updateStatusMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ustatusMaster = await StatusMaster.findByIdAndUpdate(id, req.body);

  if (!ustatusMaster) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete StatusMaster by id => /api/statusmaster/:id
exports.deleteStatusMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dstatusMaster = await StatusMaster.findByIdAndRemove(id);

  if (!dstatusMaster) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
