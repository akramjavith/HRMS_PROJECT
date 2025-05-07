const Raiseissue = require("../../../model/modules/project/raiseissue");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Raiseissues =>/api/raiseissue
exports.getAllRaiseissue = catchAsyncErrors(async (req, res, next) => {
  let raiseissue;
  try {
    raiseissue = await Raiseissue.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!raiseissue) {
    return next(new ErrorHandler("Raiseissue not found!", 404));
  }
  return res.status(200).json({
    raiseissue,
  });
});

//create new raiseissue => /api/raiseissue/new
exports.addRaiseissue = catchAsyncErrors(async (req, res, next) => {
  let araiseissue = await Raiseissue.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single raiseissue=> /api/raiseissue/:id
exports.getSingleRaiseissue = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sraiseissue = await Raiseissue.findById(id);
  if (!sraiseissue) {
    return next(new ErrorHandler("Raiseissue not found", 404));
  }
  return res.status(200).json({
    sraiseissue,
  });
});
//update raiseissue by id => /api/raiseissue/:id
exports.updateRaiseissue = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uraiseissue = await Raiseissue.findByIdAndUpdate(id, req.body);
  if (!uraiseissue) {
    return next(new ErrorHandler("Raiseissue not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete raiseissue by id => /api/raiseissue/:id
exports.deleteRaiseissue = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let draiseissue = await Raiseissue.findByIdAndRemove(id);
  if (!draiseissue) {
    return next(new ErrorHandler("Raiseissue not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
