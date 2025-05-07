const InterviewQuestion = require("../../../model/modules/interview/interviewquestions");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewAnswerAllot = require("../../../model/modules/interview/InterviewQuestionAnswerAllot");
const InterviewStatusAllot = require("../../../model/modules/interview/interviewformdesign");
const InterviewQuestionGrouping = require("../../../model/modules/interview/interviewquestiongrouping");
const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");

//get All InterviewQuestion =>/api/InterviewQuestion
exports.getAllInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  let interviewquestions;
  try {
    interviewquestions = await InterviewQuestion.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewquestions) {
    return next(new ErrorHandler("InterviewQuestion not found!", 404));
  }
  return res.status(200).json({
    interviewquestions,
  });
});

//get All InterviewQuestion =>/api/InterviewQuestion
exports.getInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  let interviewquestions;
  try {
    interviewquestions = await InterviewQuestion.find({ typingtest: false });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewquestions) {
    return next(new ErrorHandler("InterviewQuestion not found!", 404));
  }
  return res.status(200).json({
    interviewquestions,
  });
});
//get All InterviewTypingQuestion =>/api/InterviewQuestion
exports.getInterviewTypingQuestion = catchAsyncErrors(
  async (req, res, next) => {
    let interviewquestions;
    try {
      interviewquestions = await InterviewQuestion.find({ typingtest: true });
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!interviewquestions) {
      return next(new ErrorHandler("InterviewQuestion not found!", 404));
    }
    return res.status(200).json({
      interviewquestions,
    });
  }
);

//create new InterviewQuestion => /api/InterviewQuestion/new
exports.addInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  let aInterviewQuestion = await InterviewQuestion.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single InterviewQuestion => /api/InterviewQuestion/:id
exports.getSingleInterviewQuestion = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewquestion = await InterviewQuestion.findById(id);
    if (!sinterviewquestion) {
      return next(new ErrorHandler("InterviewQuestion not found", 404));
    }
    return res.status(200).json({
      sinterviewquestion,
    });
  }
);

//update InterviewQuestion by id => /api/InterviewQuestion/:id
exports.updateInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uinterviewquestion = await InterviewQuestion.findByIdAndUpdate(
    id,
    req.body
  );
  if (!uinterviewquestion) {
    return next(new ErrorHandler("InterviewQuestion not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete InterviewQuestion by id => /api/InterviewQuestion/:id
exports.deleteInterviewQuestion = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dinterviewquestion = await InterviewQuestion.findByIdAndRemove(id);
  if (!dinterviewquestion) {
    return next(new ErrorHandler("InterviewQuestion not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete questions  => /api/overalldelete/interviewquestions
exports.overallDeleteInterviewQuestions = catchAsyncErrors(
  async (req, res, next) => {
    const { mode, category, subcategory, question } = req.body;
    let answerallot, statusallot, questiongrouping, questionorder;
    function checkPageUsage(
      answerallot,
      statusallot,
      questiongrouping,
      questionorder
    ) {
      let usedPages = "";

      if (answerallot || statusallot || questiongrouping || questionorder) {
        if (answerallot) usedPages += "Answer Allot, ";
        if (statusallot) usedPages += "Status Allot, ";
        if (questiongrouping) usedPages += "Question Grouping, ";
        if (questionorder) usedPages += "Question Order, ";
      }

      return usedPages.trim();
    }

    [answerallot, statusallot, questiongrouping, questionorder] =
      await Promise.all([
        InterviewAnswerAllot.countDocuments({
          category,
          subcategory,
          question,
          mode,
        }),
        InterviewStatusAllot.countDocuments({
          category,
          subcategory,
          question,
          mode,
        }),
        InterviewQuestionGrouping.countDocuments({
          mode,
          category,
          subcategory,
          question: { $in: question },
        }),
        InterviewQuestionsOrder.countDocuments({
          category,
          subcategory,
          question: { $in: question },
        }),
      ]);

    const usedPages = checkPageUsage(
      answerallot,
      statusallot,
      questiongrouping,
      questionorder
    );

    if (usedPages) {
      return next(
        new ErrorHandler(
          `This Question Datas already used in ${usedPages} Pages`,
          404
        )
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete questions  => /api/overallbulkdelete/interviewquestions
exports.overallBulkDeleteInterviewQuestions = catchAsyncErrors(
  async (req, res, next) => {
    let statusallot, answerallot, interviewquestions, result, count;
    let id = req.body.id;
    try {
      interviewquestions = await InterviewQuestion.find();
      const answer = interviewquestions?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      [answerallot, statusallot, questiongrouping, statuquestionorder] =
        await Promise.all([
          InterviewAnswerAllot.find(),
          InterviewStatusAllot.find(),
          InterviewQuestionGrouping.find(),
          InterviewQuestionsOrder.find(),
        ]);

      const unmatchedAnswerAllot = answer
        .filter((answers) =>
          answerallot.some(
            (sub) =>
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub.question === answers.name &&
              sub.quesmode === answers.mode
          )
        )
        ?.map((data) => data._id?.toString()); //questions
      const unmatchedStatusAllot = answer
        .filter((answers) =>
          statusallot.some(
            (sub) =>
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub.question === answers.name &&
              sub.quesmode === answers.mode
          )
        )
        ?.map((data) => data._id?.toString()); //questions

      const unmatchedQuestionGrouping = answer
        .filter((answers) =>
          questiongrouping.some(
            (sub) =>
              sub.mode === answers.mode &&
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub?.question?.includes(answers?.name)
          )
        )
        ?.map((data) => data._id?.toString());

      const unmatchedQuestionOrder = answer
        .filter((answers) =>
          statuquestionorder.some(
            (sub) =>
              sub.category === answers.category &&
              sub.subcategory === answers.subcategory &&
              sub?.question?.includes(answers?.name)
          )
        )
        ?.map((data) => data._id?.toString()); //questions

      const duplicateId = [
        ...unmatchedAnswerAllot,
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

//overall edit questions  => /api/overalledit/interviewquestions
exports.overallEditInterviewQuestions = catchAsyncErrors(
  async (req, res, next) => {
    const {
      oldcategory,
      newcategory,
      oldsubcategory,
      newsubcategory,
      oldquestion,
      newquestion,
      oldsubquestion,
      newsubquestion,
      mode,
    } = req.body;
    try {
      await Promise.all([
        InterviewAnswerAllot.updateMany(
          {
            category: oldcategory,
            subcategory: oldsubcategory,
            question: oldquestion,
            mode,
          },
          {
            $set: {
              category: newcategory,
              subcategory: newsubcategory,
              question: newquestion,
            },
          }
        ),
        InterviewStatusAllot.updateMany(
          {
            category: oldcategory,
            subcategory: oldsubcategory,
            question: oldquestion,
            mode,
          },
          {
            $set: {
              category: newcategory,
              subcategory: newsubcategory,
              question: newquestion,
            },
          }
        ),
        InterviewQuestionGrouping.updateMany(
          {
            $and: [
              { category: oldcategory },
              { subcategory: oldsubcategory },
              { question: oldquestion },
              { mode: mode },
              { "interviewForm.question": oldquestion },
            ],
          },
          {
            $set: {
              category: newcategory,
              subcategory: newsubcategory,
              "question.$[elem]": newquestion,
              "interviewForm.$[formElem].question": newquestion,
            },
          },
          {
            arrayFilters: [
              { elem: oldquestion },
              { "formElem.question": oldquestion },
            ],
          }
        ),
        InterviewQuestionsOrder.updateMany(
          {
            $and: [
              { category: oldcategory },
              { subcategory: oldsubcategory },
              { question: oldquestion },
              { "interviewForm.question": oldquestion },
            ],
          },
          {
            $set: {
              category: newcategory,
              subcategory: newsubcategory,
              "question.$[elem]": newquestion,
              "interviewForm.$[formElem].question": newquestion,
            },
          },
          {
            arrayFilters: [
              { elem: oldquestion },
              { "formElem.question": oldquestion },
            ],
          }
        ),
      ]);
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({ updated: true });
  }
);

exports.skippedInterviewQuestion = async (req, res) => {
  try {
    let totalProjects, result;
    const { page, pageSize } = req.body;

    totalProjects = await InterviewQuestion.countDocuments({
      typingtest: false,
    });

    // Execute the filter query on the User model
    allusers = await InterviewQuestion.find({ typingtest: false })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = allusers;
    return res.status(200).json({
      allusers,
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// exports.overallEditInterviewQuestions = catchAsyncErrors(
//   async (req, res, next) => {
//     const {
//       oldcategory,
//       newcategory,
//       oldsubcategory,
//       newsubcategory,
//       oldquestion,
//       newquestion,
//       oldsubquestion,
//       newsubquestion,
//     } = req.body;
//     try {
//       //   await InterviewAnswerAllot.updateMany(
//       //     {
//       //       $and: [
//       //         { category: oldcategory },
//       //         { subcategory: oldsubcategory },
//       //         { question: oldquestion },
//       //         // { "secondarytodo.question": { $in: oldsubquestion } },
//       //       ],
//       //     },
//       //     {
//       //       $set: {
//       //         category: newcategory,
//       //         subcategory: newsubcategory,
//       //         question: newquestion,
//       //         // "secondarytodo.$[subElem].question": newsubquestion,
//       //       },
//       //     }
//       //     // {
//       //     //   arrayFilters: [{ "subElem.question": { $in: oldsubquestion } }],
//       //     // }
//       //   );

//       //   await InterviewStatusAllot.updateMany(
//       //     {
//       //       $and: [
//       //         { category: oldcategory },
//       //         { subcategory: oldsubcategory },
//       //         { question: oldquestion },
//       //         // { "secondarytodo.question": { $in: oldsubquestion } },
//       //       ],
//       //     },
//       //     {
//       //       $set: {
//       //         category: newcategory,
//       //         subcategory: newsubcategory,
//       //         question: newquestion,
//       //         // "secondarytodo.$[subElem].question": newsubquestion,
//       //       },
//       //     }
//       //     // {
//       //     //   arrayFilters: [{ "subElem.question": { $in: oldsubquestion } }],
//       //     // }
//       //   );
//       //   await InterviewQuestionGrouping.updateMany(
//       //     {
//       //       $or: [
//       //         { category: oldcategory },
//       //         { subcategory: oldsubcategory },
//       //         { question: oldquestion },
//       //         { "interviewForm.question": oldquestion },
//       //         // { "interviewForm.secondarytodo.question": { $in: oldsubquestion } }, // Use $in to match elements in the array
//       //       ],
//       //     },
//       //     {
//       //       $set: {
//       //         category: newcategory,
//       //         subcategory: newsubcategory,
//       //         "question.$[elem]": newquestion,
//       //         "interviewForm.$[formElem].question": newquestion,
//       //         // "interviewForm.$[formElem].secondarytodo.$[subElem].question":
//       //         //   newsubquestion,
//       //       },
//       //     },
//       //     {
//       //       arrayFilters: [
//       //         { elem: oldquestion },
//       //         { "formElem.question": oldquestion },
//       //         // { "subElem.question": { $in: oldsubquestion } }, // Use $in to match elements in the array
//       //       ],
//       //     }
//       //   );

//       await InterviewQuestionGrouping.updateMany(
//         {
//           category: oldcategory,
//           subcategory: oldsubcategory,
//           question: oldquestion,
//           "interviewForm.secondarytodo.question": { $in: oldsubquestion },
//         },
//         {
//           $set: {
//             "interviewForm.$[formElem].secondarytodo.$[subElem].question": {
//               $map: {
//                 input:
//                   "$interviewForm.$[formElem].secondarytodo.$[subElem].question",
//                 as: "subQuestion",
//                 in: {
//                   $cond: [
//                     { $in: ["$$subQuestion", oldsubquestion] },
//                     {
//                       $arrayElemAt: [
//                         newsubquestion,
//                         { $indexOfArray: [oldsubquestion, "$$subQuestion"] },
//                       ],
//                     },
//                     "$$subQuestion",
//                   ],
//                 },
//               },
//             },
//           },
//         },
//         {
//           arrayFilters: [
//             { "formElem.question": oldquestion },
//             { "subElem.question": { $in: oldsubquestion } },
//           ],
//         }
//       );

//       //   await InterviewQuestionsOrder.updateMany(
//       //     {
//       //       $or: [
//       //         { category: oldcategory },
//       //         { subcategory: oldsubcategory },
//       //         { question: oldquestion },
//       //         { "interviewForm.question": oldquestion },
//       //         // { "interviewForm.secondarytodo.question": { $in: oldsubquestion } }, // Use $in to match elements in the array
//       //       ],
//       //     },
//       //     {
//       //       $set: {
//       //         category: newcategory,
//       //         subcategory: newsubcategory,
//       //         "question.$[elem]": newquestion,
//       //         "interviewForm.$[formElem].question": newquestion,
//       //         // "interviewForm.$[formElem].secondarytodo.$[subElem].question":
//       //         //   newsubquestion,
//       //       },
//       //     },
//       //     {
//       //       arrayFilters: [
//       //         { elem: oldquestion },
//       //         { "formElem.question": oldquestion },
//       //         // { "subElem.question": { $in: oldsubquestion } }, // Use $in to match elements in the array
//       //       ],
//       //     }
//       //   );
//     } catch (err) {
//       return next(new ErrorHandler("Records not found!", 404));
//     }

//     return res.status(200).json({ updated: true });
//   }
// );
