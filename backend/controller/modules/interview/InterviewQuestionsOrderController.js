const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewRoundOrder = require("../../../model/modules/interview/interviewroundorder");
const AssignInterviewer = require("../../../model/modules/interview/assigninterviewer");

//get All InterviewQuestionsOrder =>/api/interviewquestionsorders
exports.getAllInterviewQuestionsOrder = catchAsyncErrors(
  async (req, res, next) => {
    let interviewquestionsorders;
    try {
      interviewquestionsorders = await InterviewQuestionsOrder.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!interviewquestionsorders) {
      return next(new ErrorHandler("InterviewQuestionsOrder not found!", 404));
    }
    return res.status(200).json({
      interviewquestionsorders,
    });
  }
);

//create new InterviewQuestionsOrder => /api/interviewquestionsorder/new
exports.addInterviewQuestionsOrder = catchAsyncErrors(
  async (req, res, next) => {
    let ainterviewquestionsorder = await InterviewQuestionsOrder.create(
      req.body
    );
    return res.status(200).json({
      message: "Successfully added!",
    });
  }
);

// get Single InterviewQuestionsOrder => /api/interviewquestionsorder/:id
exports.getSingleInterviewQuestionsOrder = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    if (id == "undefined" || !id) {
      return next(new ErrorHandler("Interview Question Order Not Found", 404));
    }
    let sinterviewquestionsorder = await InterviewQuestionsOrder.findById(id);
    if (!sinterviewquestionsorder) {
      return next(new ErrorHandler("Interview Question Order Not Found", 404));
    }
    return res.status(200).json({
      sinterviewquestionsorder,
    });
  }
);

//update InterviewQuestionsOrder by id => /api/interviewquestionsorder/:id
exports.updateInterviewQuestionsOrder = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let uinterviewquestionsorder =
      await InterviewQuestionsOrder.findByIdAndUpdate(id, req.body);
    if (!uinterviewquestionsorder) {
      return next(new ErrorHandler("InterviewQuestionsOrder not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
  }
);

//delete InterviewQuestionsOrder by id => /api/interviewquestionsorder/:id
exports.deleteInterviewQuestionsOrder = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let dinterviewquestionsorder =
      await InterviewQuestionsOrder.findByIdAndRemove(id);
    if (!dinterviewquestionsorder) {
      return next(new ErrorHandler("InterviewQuestionsOrder not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
  }
);

//overall delete question grouping  => /api/overalldelete/interviewquestionorder
exports.overallDeleteInterviewQuestionOrder = catchAsyncErrors(
  async (req, res, next) => {
    const { designation, round } = req.body;
    let roundorder, assigninterviewer;
    function checkPageUsage(roundorder, assigninterviewer) {
      let usedPages = "";

      if (roundorder || assigninterviewer) {
        if (roundorder) usedPages += "Round Order, ";
        if (assigninterviewer) usedPages += "Assign Interviewer, ";
      }

      return usedPages.trim();
    }

    roundorder = await InterviewRoundOrder.countDocuments({
      round: { $in: round },
      designation,
    });
    assigninterviewer = await AssignInterviewer.countDocuments({
      round: { $in: round },
      designation,
      type: "Interviewer",
    });

    const usedPages = checkPageUsage(roundorder, assigninterviewer);

    if (usedPages) {
      return next(
        new ErrorHandler(`This Data already used in ${usedPages} Pages`, 404)
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete question grouping  => /api/overallbulkdelete/interviewquestionorder
exports.overallBulkDeleteInterviewQuestionOrder = catchAsyncErrors(
  async (req, res, next) => {
    let interviewquestiongrouping, assigninterviewer, roundorder, result, count;
    let id = req.body.id;
    try {
      interviewquestiongrouping = await InterviewQuestionsOrder.find();
      const answer = interviewquestiongrouping?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      roundorder = await InterviewRoundOrder.find();
      assigninterviewer = await AssignInterviewer.find();

      const unmatchedRoundOrder = answer
        .filter((answers) =>
          roundorder.some(
            (sub) =>
              answers.designation === sub?.designation &&
              sub?.round?.includes(answers?.round)
          )
        )
        ?.map((data) => data._id?.toString());
      const unmatchedAssignInterviewer = answer
        .filter((answers) =>
          assigninterviewer.some(
            (sub) =>
              sub.type === "Interviewer" &&
              answers.designation === sub?.designation &&
              sub?.round?.includes(answers?.round)
          )
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [
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
