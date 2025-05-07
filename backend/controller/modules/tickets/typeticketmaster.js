const TicketMasterType = require("../../../model/modules/tickets/typetickermaster");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get all ticketstype

exports.getAllTicketMasterType = catchAsyncErrors(async (req, res, next) => {
  let ticketmastertype;
  try {
    ticketmastertype = await TicketMasterType.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ticketmastertype) {
    return next(new ErrorHandler("type not found", 404));
  }
  // Add serial numbers to the ticketmastertype
  const alldoctype = ticketmastertype.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    ticketmastertype: alldoctype,
  });
});

exports.addTicketMasterType = catchAsyncErrors(async (req, res, next) => {
  await TicketMasterType.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

exports.getSingleTicketMasterType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sticketmastertype = await TicketMasterType.findById(id);
  if (!sticketmastertype) {
    return next(new ErrorHandler("tickets not found"));
  }
  return res.status(200).json({
    sticketmastertype,
  });
});

exports.updateTicketMasterType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uticketmastertype = await TicketMasterType.findByIdAndUpdate(id, req.body);

  if (!uticketmastertype) {
    return next(new ErrorHandler("ticket not found"));
  }
  return res.status(200).json({
    message: "Update Successfully",
    uticketmastertype,
  });
});

//delete ticketmastertype by id
exports.deleteTicketMasterType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dticketmastertype = await TicketMasterType.findByIdAndRemove(id);
  if (!dticketmastertype) {
    return next(new ErrorHandler("ticket not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
