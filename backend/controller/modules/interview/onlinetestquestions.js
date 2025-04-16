
const OnlineTestQuestion = require('../../../model/modules/interview/onlinetestquestions');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All OnlineTestQuestions => /api/onlinetestquestions
exports.getAllOnlineTestQuestions = catchAsyncErrors(async (req, res, next) => {
  let onlinetestquestions;
  try {
    onlinetestquestions = await OnlineTestQuestion.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!onlinetestquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    onlinetestquestions,
  });
});

// Create new OnlineTestQuestions=> /api/onlinetestquestions/new
exports.addOnlineTestQuestions = catchAsyncErrors(async (req, res, next) => {

  let aonlinetestquestions = await OnlineTestQuestion.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle OnlineTestQuestions => /api/onlinetestquestions/:id
exports.getSingleOnlineTestQuestions = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sonlinetestquestions = await OnlineTestQuestion.findById(id);

  if (!sonlinetestquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sonlinetestquestions,
  });
});

// update OnlineTestQuestions by id => /api/onlinetestquestions/:id
exports.updateOnlineTestQuestions = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uonlinetestquestions = await OnlineTestQuestion.findByIdAndUpdate(id, req.body);
  if (!uonlinetestquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete OnlineTestQuestions by id => /api/onlinetestquestions/:id
exports.deleteOnlineTestQuestions = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let donlinetestquestions = await OnlineTestQuestion.findByIdAndRemove(id);

  if (!donlinetestquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
