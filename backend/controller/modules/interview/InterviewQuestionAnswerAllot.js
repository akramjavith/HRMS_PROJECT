const InterviewAnswerAllot = require("../../../model/modules/interview/InterviewQuestionAnswerAllot");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewStatusAllot = require("../../../model/modules/interview/interviewformdesign");
const InterviewQuestionGrouping = require("../../../model/modules/interview/interviewquestiongrouping");
const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");

//get All InterviewAnswerAllot =>/api/InterviewAnswerAllot
exports.getAllInterviewFormAllot = catchAsyncErrors(async (req, res, next) => {
  let interviewformdesign;
  try {
    interviewformdesign = await InterviewAnswerAllot.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewformdesign) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    interviewformdesign,
  });
});

//create new InterviewAnswerAllot => /api/InterviewAnswerAllot/new
exports.addInterviewFormAllot = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let ainterviewformdesign = await InterviewAnswerAllot.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single InterviewAnswerAllot => /api/InterviewAnswerAllot/:id
exports.getSingleInterviewFormAllot = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewformdesign = await InterviewAnswerAllot.findById(id);
    if (!sinterviewformdesign) {
      return next(new ErrorHandler("InterviewAnswerAllot not found", 404));
    }
    return res.status(200).json({
      sinterviewformdesign,
    });
  }
);

//update InterviewAnswerAllot by id => /api/InterviewAnswerAllot/:id
exports.updateInterviewFormAllot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uinterviewformdesign = await InterviewAnswerAllot.findByIdAndUpdate(
    id,
    req.body
  );
  if (!uinterviewformdesign) {
    return next(new ErrorHandler("InterviewAnswerAllot not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete InterviewAnswerAllot by id => /api/InterviewAnswerAllot/:id
exports.deleteInterviewFormAllot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dinterviewformdesign = await InterviewAnswerAllot.findByIdAndRemove(id);
  if (!dinterviewformdesign) {
    return next(new ErrorHandler("InterviewAnswerAllot not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete answerallot  => /api/overalldelete/interviewanswerallot
exports.overallDeleteInterviewAnswerAllot = catchAsyncErrors(
  async (req, res, next) => {
    const { mode, category, subcategory, question } = req.body;
    let statusallot, questiongrouping, questionorder;
    function checkPageUsage(statusallot, questiongrouping, questionorder) {
      let usedPages = "";

      if (statusallot || questiongrouping || questionorder) {
        if (statusallot) usedPages += "Status Allot, ";
        if (questiongrouping) usedPages += "Question Grouping, ";
        if (questionorder) usedPages += "Question Order, ";
      }

      return usedPages.trim();
    }

    [statusallot, questionorder] = await Promise.all([
      InterviewStatusAllot.countDocuments({
        category,
        subcategory,
        question,
        mode,
      }),
      InterviewQuestionsOrder.countDocuments({
        category,
        subcategory,
        question: { $in: question },
      }),
    ]);

    if (mode === "Typing Test") {
      questiongrouping = await InterviewQuestionGrouping.countDocuments({
        mode: "Typing Test",
        category,
        subcategory,
      });
    } else {
      questiongrouping = await InterviewQuestionGrouping.countDocuments({
        mode: "Questions",
        category,
        subcategory,
        question: { $in: question },
      });
    }

    const usedPages = checkPageUsage(
      statusallot,
      questiongrouping,
      questionorder
    );

    if (usedPages) {
      return next(
        new ErrorHandler(`This Data already used in ${usedPages} Pages`, 404)
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete answerallot  => /api/overallbulkdelete/interviewanswerallot
exports.overallBulkDeleteInterviewAnswerAllot = catchAsyncErrors(
  async (req, res, next) => {
    let statusallot, interviewanswerallot, result, count;
    let id = req.body.id;
    try {
      interviewanswerallot = await InterviewAnswerAllot.find();
      const answer = interviewanswerallot?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      [statusallot, questiongrouping, statuquestionorder] = await Promise.all([
        InterviewStatusAllot.find(),
        InterviewQuestionGrouping.find(),
        InterviewQuestionsOrder.find(),
      ]);
      const unmatchedStatusAllot = answer
        .filter((answers) =>
          statusallot.some(
            (sub) =>
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub.question === answers.question &&
              sub.mode === answers.mode
          )
        )
        ?.map((data) => data._id?.toString()); //questions

      const unmatchedQuestionGrouping = answer
        .filter((answers) => {
          return questiongrouping.some((sub) => {
            if (answers.mode === "Typing Test") {
              return (
                sub.category === answers.category &&
                sub.subcategory === answers.subcategory &&
                sub.mode === "Typing Test"
              );
            } else {
              return (
                sub.category === answers.category &&
                sub.subcategory === answers.subcategory &&
                sub.mode === "Questions" &&
                sub?.question?.includes(answers?.question)
              );
            }
          });
        })
        .map((data) => data._id?.toString());

      const unmatchedQuestionOrder = answer
        .filter((answers) =>
          statuquestionorder.some(
            (sub) =>
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub?.question?.includes(answers?.question)
          )
        )
        ?.map((data) => data._id?.toString()); //questions

      const duplicateId = [
        ...unmatchedStatusAllot,
        ...unmatchedQuestionGrouping,
        ...unmatchedQuestionOrder,
      ];
      result = id?.filter((data) => !duplicateId?.includes(data));
      count = id?.filter((data) => duplicateId?.includes(data))?.length;
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      count: count,
      result,
    });
  }
);

//overall edit answerallot  => /api/overalledit/interviewanswerallot
exports.overallEditInterviewAnswerAllot = catchAsyncErrors(
  async (req, res, next) => {
    const {
      mode,
      category,
      subcategory,
      question,
      speed,
      accuracy,
      mistakes,
      duration,
    } = req.body;

    console.log(req.body);

    await InterviewStatusAllot.updateMany(
      {
        mode,
        category,
        subcategory,
        question,
      },
      {
        $set: {
          typingspeed: speed,
          typingaccuracy: accuracy,
          typingmistakes: mistakes,
          typingduration: duration,
        },
      }
    );

    return res.status(200).json({ updated: true });
  }
);