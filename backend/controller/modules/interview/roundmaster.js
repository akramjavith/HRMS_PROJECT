const Roundmaster = require("../../../model/modules/interview/roundmaster");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewRoundOrder = require("../../../model/modules/interview/interviewroundorder");
const InterviewQuestionGrouping = require("../../../model/modules/interview/interviewquestiongrouping");
const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");
const AssigninInterviewer = require("../../../model/modules/interview/assigninterviewer");
const assigninterviewer = require("../../../model/modules/interview/assigninterviewer");

//get All Roundmaster =>/api/Roundmaster
exports.getAllRoundmaster = catchAsyncErrors(async (req, res, next) => {
  let roundmasters;
  try {
    roundmasters = await Roundmaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!roundmasters) {
    return next(new ErrorHandler("Roundmaster not found!", 404));
  }
  return res.status(200).json({
    roundmasters,
  });
});

//create new Roundmaster => /api/Roundmaster/new
exports.addRoundmaster = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aRoundmaster = await Roundmaster.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Roundmaster => /api/Roundmaster/:id
exports.getSingleRoundmaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sroundmaster = await Roundmaster.findById(id);
  if (!sroundmaster) {
    return next(new ErrorHandler("Roundmaster not found", 404));
  }
  return res.status(200).json({
    sroundmaster,
  });
});

//update Roundmaster by id => /api/Roundmaster/:id
exports.updateRoundmaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uroundmaster = await Roundmaster.findByIdAndUpdate(id, req.body);
  if (!uroundmaster) {
    return next(new ErrorHandler("Roundmaster not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Roundmaster by id => /api/Roundmaster/:id
exports.deleteRoundmaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let droundmaster = await Roundmaster.findByIdAndRemove(id);
  if (!droundmaster) {
    return next(new ErrorHandler("Roundmaster not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete round master  => /api/overalldelete/interviewroundmaster
exports.overallDeleteRoundMaster = catchAsyncErrors(async (req, res, next) => {
  const { round } = req.body;
  let questiongrouping, roundorder, questionorder, assigninterviewer;

  function checkPageUsage(
    questiongrouping,
    questionorder,
    roundorder,
    assigninterviewer
  ) {
    let usedPages = "";

    if (questiongrouping || questionorder || roundorder || assigninterviewer) {
      if (roundorder) usedPages += "Round Order, ";
      if (questiongrouping) usedPages += "Question Grouping, ";
      if (questionorder) usedPages += "Question Order, ";
      if (assigninterviewer) usedPages += "Assign Interviewer, ";
    }

    return usedPages.trim();
  }

  [questiongrouping, questionorder, roundorder, assigninterviewer] =
    await Promise.all([
      InterviewQuestionGrouping.countDocuments({ round }),
      InterviewQuestionsOrder.countDocuments({ round }),
      InterviewRoundOrder.countDocuments({ round: { $in: round } }),
      AssigninInterviewer.countDocuments({ round: { $in: round } }),
    ]);
  const usedPages = checkPageUsage(
    questiongrouping,
    questionorder,
    roundorder,
    assigninterviewer
  );

  if (usedPages) {
    return next(
      new ErrorHandler(
        `This Round Name already used in ${usedPages} Pages`,
        404
      )
    );
  }

  return res.status(200).json({ mayidelete: true });
});

//overall bulk delete round master  => /api/overallbulkdelete/interviewroundmaster
exports.overallBulkDeleteRoundMaster = catchAsyncErrors(
  async (req, res, next) => {
    let questiongrouping,
      questionorder,
      roundorder,
      roundmaster,
      result,
      count,
      assigninterviewer;
    let id = req.body.id;
    try {
      roundmaster = await Roundmaster.find();
      const answer = roundmaster?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      [questiongrouping, questionorder, roundorder, assigninterviewer] =
        await Promise.all([
          InterviewQuestionGrouping.find(),
          InterviewQuestionsOrder.find(),
          InterviewRoundOrder.find(),
          AssigninInterviewer.find(),
        ]);

      const unmatchedRoundOrder = answer
        .filter((answers) =>
          roundorder.some((sub) => sub.round?.includes(answers?.nameround))
        )
        ?.map((data) => data._id?.toString());
      const unmatchedAssignInterviewer = answer
        .filter((answers) =>
          assigninterviewer.some((sub) =>
            sub?.round?.includes(answers?.nameround)
          )
        )
        ?.map((data) => data._id?.toString());

      const unmatchedQuestionOrder = answer
        .filter((answers) =>
          questionorder.some((sub) => sub.round === answers.nameround)
        )
        ?.map((data) => data._id?.toString());

      const unmatchedQuestionGrouping = answer
        .filter((answers) =>
          questiongrouping.some((sub) => sub.round === answers.nameround)
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [
        ...unmatchedQuestionGrouping,
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

//overall edit round master  => /api/overalledit/interviewroundmaster
exports.overallEditRoundMaster = catchAsyncErrors(async (req, res, next) => {
  const { oldround, newround } = req.body;

  await Promise.all([
    InterviewRoundOrder.updateMany(
      { round: { $elemMatch: { $in: oldround } } },
      { $set: { "round.$": newround } }
    ),
    AssigninInterviewer.updateMany(
      { round: { $elemMatch: { $in: oldround } } },
      { $set: { "round.$": newround } }
    ),
    InterviewQuestionGrouping.updateMany(
      { round: oldround },
      { $set: { round: newround } }
    ),
    InterviewQuestionsOrder.updateMany(
      { round: oldround },
      { $set: { round: newround } }
    ),
  ]);

  return res.status(200).json({ updated: true });
});