const EthernetPorts = require('../../../model/modules/account/EthernetPortsModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All EthernetPorts Name => /api/ethernetportss
exports.getAllEthernetPorts = catchAsyncErrors(async (req, res, next) => {
  let ethernetports;
  try {
    ethernetports = await EthernetPorts.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ethernetports) {
    return next(new ErrorHandler("EthernetPorts Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    ethernetports,
  });
});

// Create new EthernetPorts=> /api/ethernetports/new
exports.addEthernetPorts = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await EthernetPorts.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("EthernetPorts Name already exist!", 400));
  }

  let aethernetports = await EthernetPorts.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle EthernetPorts => /api/ethernetports/:id
exports.getSingleEthernetPorts = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sethernetports = await EthernetPorts.findById(id);

  if (!sethernetports) {
    return next(new ErrorHandler("EthernetPorts Name not found!", 404));
  }
  return res.status(200).json({
    sethernetports,
  });
});

// update EthernetPorts by id => /api/ethernetports/:id
exports.updateEthernetPorts = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uethernetports = await EthernetPorts.findByIdAndUpdate(id, req.body);
  if (!uethernetports) {
    return next(new ErrorHandler("EthernetPorts Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete EthernetPorts by id => /api/ethernetports/:id
exports.deleteEthernetPorts = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dethernetports = await EthernetPorts.findByIdAndRemove(id);

  if (!dethernetports) {
    return next(new ErrorHandler("EthernetPorts Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
