const ExitInterviewtestmaster = require("../../../model/modules/interview/exitinterviewtestmaster");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewQuestionGrouping = require("../../../model/modules/interview/interviewquestiongrouping");

//get AlInterviewt ExitInterviewtestmaster =>/api/interviewtestmaster
exports.getAllExitInterviewTestMaster = catchAsyncErrors(async (req, res, next) => {
  let interviewtestmasters;
  try {
    interviewtestmasters = await ExitInterviewtestmaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewtestmasters) {
    return next(new ErrorHandler("ExitInterviewtestmaster not found!", 404));
  }
  return res.status(200).json({
    interviewtestmasters,
  });
});

//create new ExitInterviewtestmaster => /api/interviewtestmaster/new
exports.addExitInterviewTestMaster = catchAsyncErrors(async (req, res, next) => {
  const { type, category, subcategory, testname } = req.body;

  let filteredData = await ExitInterviewtestmaster.find({
    testname: { $regex: testname, $options: "i" },
    type,
    category,
    subcategory,
  });

  if (filteredData.length > 0) {
    return res.status(400).json({
      message: "Data Already Exist!",
    });
  }

  let aInterviewtestmaster = await ExitInterviewtestmaster.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single ExitInterviewtestmaster => /api/ExitInterviewtestmaster/:id
exports.getSingleExitInterviewTestMaster = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewtestmaster = await ExitInterviewtestmaster.findById(id);
    if (!sinterviewtestmaster) {
      return next(new ErrorHandler("ExitInterviewtestmaster not found", 404));
    }
    return res.status(200).json({
      sinterviewtestmaster,
    });
  }
);

//update ExitInterviewtestmaster by id => /api/ExitInterviewtestmaster/:id
exports.updateExitInterviewTestMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const { type, category, subcategory, testname } = req.body;

  try {
    let filteredData = await ExitInterviewtestmaster.find({
      _id: { $ne: id },
      testname: { $regex: testname, $options: "i" },
      type,
      category,
      subcategory,
    });

    if (filteredData.length > 0) {
      return res.status(400).json({
        message: "Data Already Exist!",
      });
    }

    let uinterviewtestmaster = await ExitInterviewtestmaster.findByIdAndUpdate(
      id,
      req.body
    );
    if (!uinterviewtestmaster) {
      return next(new ErrorHandler("ExitInterviewtestmaster not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//delete ExitInterviewtestmaster by id => /api/ExitInterviewtestmaster/:id
exports.deleteExitInterviewTestMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dinterviewtestmaster = await ExitInterviewtestmaster.findByIdAndRemove(id);
  if (!dinterviewtestmaster) {
    return next(new ErrorHandler("ExitInterviewtestmaster not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete test master  => /api/overalldelete/interviewtestmaster
exports.overallDeleteExitTestMaster = catchAsyncErrors(async (req, res, next) => {
  const { category, subcategory, testname, duration } = req.body;
  let questiongrouping;

  // questiongrouping = await InterviewQuestionGrouping.countDocuments({
  //   $and: [{ category }, { subcategory }, { testname }, { duration }],
  // });

  // if (questiongrouping) {
  //   return next(
  //     new ErrorHandler(
  //       `This Test Details already used in Question Grouping`,
  //       404
  //     )
  //   );
  // }

  return res.status(200).json({ mayidelete: true });
});

//overall bulk delete test master  => /api/overallbulkdelete/interviewtestmaster
exports.overallBulkDeleteExitTestMaster = catchAsyncErrors(
  async (req, res, next) => {
    let questiongrouping, testmaster, result, count;
    let id = req.body.id;
    try {
      testmaster = await ExitInterviewtestmaster.find();
      const answer = testmaster?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      questiongrouping = await InterviewQuestionGrouping.find();

      const unmatchedQuestionGrouping = answer
        .filter((answers) =>
          questiongrouping.some(
            (sub) =>
              sub.mode === "Test" &&
              sub.testname === answers.testname &&
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub.duration === answers.durationhours
          )
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [...unmatchedQuestionGrouping];
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

//overall edit test master  => /api/overalledit/interviewtestmaster
exports.overallEditTestMaster = catchAsyncErrors(async (req, res, next) => {
  const {
    oldtestname,
    newtestname,
    oldcategory,
    newcategory,
    oldsubcategory,
    newsubcategory,
    oldduration,
    newduration,
  } = req.body;

  try {
    await InterviewQuestionGrouping.updateMany(
      {
        testname: oldtestname,
        category: oldcategory,
        subcategory: oldsubcategory,
        duration: oldduration,
        mode: "Test",
      },
      {
        $set: {
          testname: newtestname,
          category: newcategory,
          subcategory: newsubcategory,
          duration: newduration,
        },
      }
    );
    return res.status(200).json({ updated: true });
  } catch (error) {
    console.error("Error updating documents:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating documents" });
  }
});