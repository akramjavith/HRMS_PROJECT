const Slot = require('../../../model/modules/account/SlotModel');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Slot Name => /api/slots
exports.getAllSlot = catchAsyncErrors(async (req, res, next) => {
  let slot;
  try {
    slot = await Slot.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!slot) {
    return next(new ErrorHandler("Slot Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    slot,
  });
});

// Create new Slot=> /api/slot/new
exports.addSlot = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await Slot.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Slot Name already exist!", 400));
  }

  let aslot = await Slot.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Slot => /api/slot/:id
exports.getSingleSlot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sslot = await Slot.findById(id);

  if (!sslot) {
    return next(new ErrorHandler("Slot Name not found!", 404));
  }
  return res.status(200).json({
    sslot,
  });
});

// update Slot by id => /api/slot/:id
exports.updateSlot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uslot = await Slot.findByIdAndUpdate(id, req.body);
  if (!uslot) {
    return next(new ErrorHandler("Slot Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Slot by id => /api/slot/:id
exports.deleteSlot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dslot = await Slot.findByIdAndRemove(id);

  if (!dslot) {
    return next(new ErrorHandler("Slot Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
