
const OnlineTestMaster = require('../../../model/modules/interview/onlinetestmaster');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All OnlineTestMaster => /api/onlinetestmasters
exports.getAllOnlineTestMasters = catchAsyncErrors(async (req, res, next) => {
  let onlinetestmasters;
  try {
    onlinetestmasters = await OnlineTestMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!onlinetestmasters) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    onlinetestmasters,
  });
});

// Create new OnlineTestMaster=> /api/onlinetestmasters/new
exports.addOnlineTestMasters = catchAsyncErrors(async (req, res, next) => {

  let aonlinetestmasters = await OnlineTestMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle OnlineTestMaster => /api/onlinetestmasters/:id
exports.getSingleOnlineTestMasters = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sonlinetestmasters = await OnlineTestMaster.findById(id);

  if (!sonlinetestmasters) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sonlinetestmasters,
  });
});

// update OnlineTestMaster by id => /api/onlinetestmasters/:id
exports.updateOnlineTestMasters = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uonlinetestmasters = await OnlineTestMaster.findByIdAndUpdate(id, req.body);
  if (!uonlinetestmasters) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete OnlineTestMaster by id => /api/onlinetestmasters/:id
exports.deleteOnlineTestMasters = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let donlinetestmasters = await OnlineTestMaster.findByIdAndRemove(id);

  if (!donlinetestmasters) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
