
const ExitInterviewQuestion = require('../../../model/modules/interview/exitquestionmaster');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All OnlineTestQuestions => /api/onlinetestquestions
exports.getAllExitInterviewQuestions = catchAsyncErrors(async (req, res, next) => {
  let exitquestions;
  try {
    exitquestions = await ExitInterviewQuestion.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!exitquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    exitquestions,
  });
});

// Create new OnlineTestQuestions=> /api/onlinetestquestions/new
exports.addExitInterviewQuestions = catchAsyncErrors(async (req, res, next) => {

  let aonlinetestquestions = await ExitInterviewQuestion.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle OnlineTestQuestions => /api/onlinetestquestions/:id
exports.getSingleExitInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sexitinterviewquestion = await ExitInterviewQuestion.findById(id);

  if (!sexitinterviewquestion) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sexitinterviewquestion,
  });
});

// update OnlineTestQuestions by id => /api/onlinetestquestions/:id
exports.updateExitInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uonlinetestquestions = await ExitInterviewQuestion.findByIdAndUpdate(id, req.body);
  if (!uonlinetestquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete OnlineTestQuestions by id => /api/onlinetestquestions/:id
exports.deleteExitInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let donlinetestquestions = await ExitInterviewQuestion.findByIdAndRemove(id);

  if (!donlinetestquestions) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
