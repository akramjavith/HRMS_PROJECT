const Interviewtypemaster = require("../../../model/modules/interview/interviewtypemaster");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewQuestionGrouping = require("../../../model/modules/interview/interviewquestiongrouping");
const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");

//get AlInterviewt Interviewtypemaster =>/api/Interviewtypemaster
exports.getAllInterviewtypemaster = catchAsyncErrors(async (req, res, next) => {
  let interviewtypemasters;
  try {
    interviewtypemasters = await Interviewtypemaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewtypemasters) {
    return next(new ErrorHandler("Interviewtypemaster not found!", 404));
  }
  return res.status(200).json({
    interviewtypemasters,
  });
});

//create new Interviewtypemaster => /api/Interviewtypemaster/new
exports.addInterviewtypemaster = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aInterviewtypemaster = await Interviewtypemaster.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Interviewtypemaster => /api/Interviewtypemaster/:id
exports.getSingleInterviewtypemaster = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewtypemaster = await Interviewtypemaster.findById(id);
    if (!sinterviewtypemaster) {
      return next(new ErrorHandler("Interviewtypemaster not found", 404));
    }
    return res.status(200).json({
      sinterviewtypemaster,
    });
  }
);

//update Interviewtypemaster by id => /api/Interviewtypemaster/:id
exports.updateInterviewtypemaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uinterviewtypemaster = await Interviewtypemaster.findByIdAndUpdate(
    id,
    req.body
  );
  if (!uinterviewtypemaster) {
    return next(new ErrorHandler("Interviewtypemaster not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Interviewtypemaster by id => /api/Interviewtypemaster/:id
exports.deleteInterviewtypemaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dinterviewtypemaster = await Interviewtypemaster.findByIdAndRemove(id);
  if (!dinterviewtypemaster) {
    return next(new ErrorHandler("Interviewtypemaster not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete type master  => /api/overalldelete/interviewtypemaster
exports.overallDeleteTypeMaster = catchAsyncErrors(async (req, res, next) => {
  const { type } = req.body;
  let questiongrouping, questionorder;

  function checkPageUsage(questiongrouping, questionorder) {
    let usedPages = "";

    if (questiongrouping || questionorder) {
      if (questiongrouping) usedPages += "Question Grouping, ";
      if (questionorder) usedPages += "Question Order, ";
    }

    return usedPages.trim();
  }

  questiongrouping = await InterviewQuestionGrouping.countDocuments({
    type,
  });
  questionorder = await InterviewQuestionsOrder.countDocuments({
    type,
  });

  const usedPages = checkPageUsage(questiongrouping, questionorder);

  if (usedPages) {
    return next(
      new ErrorHandler(`This Type Name already used in ${usedPages} Pages`, 404)
    );
  }

  return res.status(200).json({ mayidelete: true });
});

//overall bulk delete type master  => /api/overallbulkdelete/interviewtypemaster
exports.overallBulkDeleteTypeMaster = catchAsyncErrors(
  async (req, res, next) => {
    let questiongrouping, questionorder, typemaster, result, count;
    let id = req.body.id;
    try {
      typemaster = await Interviewtypemaster.find();
      const answer = typemaster?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      questiongrouping = await InterviewQuestionGrouping.find();
      questionorder = await InterviewQuestionsOrder.find();

      const unmatchedQuestionOrder = answer
        .filter((answers) =>
          questionorder.some((sub) => sub.type === answers.nametype)
        )
        ?.map((data) => data._id?.toString());

      const unmatchedQuestionGrouping = answer
        .filter((answers) =>
          questiongrouping.some((sub) => sub.type === answers.nametype)
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [
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

//overall edit type master  => /api/overalledit/interviewtypemaster
exports.overallEditTypeMaster = catchAsyncErrors(async (req, res, next) => {
  const { oldtype, newtype } = req.body;

  await InterviewQuestionGrouping.updateMany(
    { type: oldtype },
    { $set: { type: newtype } }
  );
  await InterviewQuestionsOrder.updateMany(
    { type: oldtype },
    { $set: { type: newtype } }
  );

  return res.status(200).json({ updated: true });
});