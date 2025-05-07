const InterviewGroupingQuestion = require("../../../model/modules/interview/interviewquestiongrouping");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");
const InterviewRoundOrder = require("../../../model/modules/interview/interviewroundorder");
const AssignInterviewer = require("../../../model/modules/interview/assigninterviewer");

//get All InterviewGroupingQuestion =>/api/InterviewGroupingQuestion
exports.getAllInterviewGroupingQuestion = catchAsyncErrors(
  async (req, res, next) => {
    let interviewgroupingquestion;
    try {
      interviewgroupingquestion = await InterviewGroupingQuestion.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!interviewgroupingquestion) {
      return next(
        new ErrorHandler("InterviewGroupingQuestion not found!", 404)
      );
    }
    return res.status(200).json({
      interviewgroupingquestion,
    });
  }
);

//get All InterviewQuestionsOrder =>/api/interviewquestiongroupings
exports.getAllInterviewGroupingQuestionFilter = catchAsyncErrors(
  async (req, res, next) => {
    let interviewgroupingquestionfilter;
    try {
      interviewgroupingquestionfilter = await InterviewGroupingQuestion.find(
        { designation: req.body.designation },
        {
          designation: 1,
          round: 1,
          mode: 1,
          roundmodmode: 1,
          type: 1,
          category: 1,
          subcategory: 1,
          duration: 1,
        }
      );
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!interviewgroupingquestionfilter) {
      return next(new ErrorHandler("Designation not found!", 404));
    }
    return res.status(200).json({
      interviewgroupingquestionfilter,
    });
  }
);

//create new InterviewGroupingQuestion => /api/InterviewGroupingQuestion/new
exports.addInterviewGroupingQuestion = catchAsyncErrors(
  async (req, res, next) => {
    let aInterviewGroupingQuestion = await InterviewGroupingQuestion.create(
      req.body
    );
    return res.status(200).json({
      message: "Successfully added!",
    });
  }
);

// get Single InterviewGroupingQuestion => /api/InterviewGroupingQuestion/:id
exports.getSingleInterviewGroupingQuestion = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewgroupingquestion = await InterviewGroupingQuestion.findById(
      id
    );

    if (!sinterviewgroupingquestion) {
      return next(new ErrorHandler("InterviewGroupingQuestion not found", 404));
    }
    return res.status(200).json({
      sinterviewgroupingquestion,
    });
  }
);

//update InterviewGroupingQuestion by id => /api/InterviewGroupingQuestion/:id
exports.updateInterviewGroupingQuestion = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let uinterviewgroupingquestion =
      await InterviewGroupingQuestion.findByIdAndUpdate(id, req.body);
    if (!uinterviewgroupingquestion) {
      return next(new ErrorHandler("InterviewGroupingQuestion not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
  }
);

//delete InterviewGroupingQuestion by id => /api/InterviewGroupingQuestion/:id
exports.deleteInterviewGroupingQuestion = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let dinterviewgroupingquestion =
      await InterviewGroupingQuestion.findByIdAndRemove(id);
    if (!dinterviewgroupingquestion) {
      return next(new ErrorHandler("InterviewGroupingQuestion not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
  }
);

//overall delete question grouping  => /api/overalldelete/interviewquestiongrouping
exports.overallDeleteInterviewQuestionGrouping = catchAsyncErrors(
  async (req, res, next) => {
    const { category, subcategory, question, designation, round } = req.body;
    let questionorder, roundorder, assigninterviewer;
    function checkPageUsage(questionorder, roundorder, assigninterviewer) {
      let usedPages = "";

      if (questionorder || roundorder || assigninterviewer) {
        if (questionorder) usedPages += "Question Order, ";
        if (roundorder) usedPages += "Round Order, ";
        if (assigninterviewer) usedPages += "Assign Interviewer, ";
      }

      return usedPages.trim();
    }

    questionorder = await InterviewQuestionsOrder.countDocuments({
      category,
      subcategory,
      round,
      question: { $elemMatch: { $in: question } },
      designation,
    });
    roundorder = await InterviewRoundOrder.countDocuments({
      round: { $in: round },
      designation,
    });
    assigninterviewer = await AssignInterviewer.countDocuments({
      round: { $in: round },
      designation,
      type: "Interviewer",
    });

    const usedPages = checkPageUsage(
      questionorder,
      roundorder,
      assigninterviewer
    );

    if (usedPages) {
      return next(
        new ErrorHandler(`This Data already used in ${usedPages} Pages`, 404)
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete question grouping  => /api/overallbulkdelete/interviewquestiongrouping
exports.overallBulkDeleteInterviewQuestionGrouping = catchAsyncErrors(
  async (req, res, next) => {
    let interviewquestiongrouping,
      assigninterviewer,
      roundorder,
      result,
      questionorder,
      count;
    let id = req.body.id;
    try {
      interviewquestiongrouping = await InterviewGroupingQuestion.find();
      const answer = interviewquestiongrouping?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      questionorder = await InterviewQuestionsOrder.find();
      roundorder = await InterviewRoundOrder.find();
      assigninterviewer = await AssignInterviewer.find();

      const unmatchedQuestionOrder = answer
        .filter((answers) =>
          questionorder.some(
            (sub) =>
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              answers?.question?.some((data) => sub.question?.includes(data)) &&
              answers.designation === sub?.designation &&
              answers.round === sub?.round
          )
        )
        ?.map((data) => data._id?.toString());

      const unmatchedRoundOrder = answer
        .filter((answers) =>
          roundorder.some(
            (sub) =>
              answers.designation === sub?.designation &&
              sub.round?.includes(answers.round)
          )
        )
        ?.map((data) => data._id?.toString());
      const unmatchedAssignInterviewer = answer
        .filter((answers) =>
          assigninterviewer.some(
            (sub) =>
              sub.type === "Interviewer" &&
              answers.designation === sub?.designation &&
              sub.round?.includes(answers.round)
          )
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [
        ...unmatchedQuestionOrder,
        ...unmatchedRoundOrder,
        ...unmatchedAssignInterviewer,
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

//overall edit interviewquestiongrouping  => /api/overalledit/interviewquestiongrouping
exports.overallEditInterviewQuestionGrouping = catchAsyncErrors(
  async (req, res, next) => {
    const {
      designation,
      round,
      category,
      subcategory,
      type,
      question,
      totalmarks,
      eligiblemark,
      markcomparison,

      duration,
    } = req.body;
    await InterviewQuestionsOrder.updateMany(
      {
        designation,
        round,
        type,
        category,
        subcategory,
        question: { $all: question },
      },
      {
        $set: {
          duration: duration,
          totalmarks: totalmarks,
          eligiblemark: eligiblemark,
          markcomparison: markcomparison,
        },
      }
    );

    return res.status(200).json({ updated: true });
  }
);
