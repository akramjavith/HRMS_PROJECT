const InterviewFormDesign = require("../../../model/modules/interview/interviewformdesign");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const InterviewQuestionGrouping = require("../../../model/modules/interview/interviewquestiongrouping");
const InterviewQuestionsOrder = require("../../../model/modules/interview/InterviewQuestionsOrderModel");

//get All InterviewFormDesign =>/api/InterviewFormDesign
exports.getAllInterviewFormDesign = catchAsyncErrors(async (req, res, next) => {
  let interviewformdesign;
  try {
    interviewformdesign = await InterviewFormDesign.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewformdesign) {
    return next(new ErrorHandler("InterviewFormDesign not found!", 404));
  }
  return res.status(200).json({
    interviewformdesign,
  });
});

//create new InterviewFormDesign => /api/InterviewFormDesign/new
exports.addInterviewFormDesign = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let ainterviewformdesign = await InterviewFormDesign.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single InterviewFormDesign => /api/InterviewFormDesign/:id
exports.getSingleInterviewFormDesign = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewformdesign = await InterviewFormDesign.findById(id);
    if (!sinterviewformdesign) {
      return next(new ErrorHandler("InterviewFormDesign not found", 404));
    }
    return res.status(200).json({
      sinterviewformdesign,
    });
  }
);

//update InterviewFormDesign by id => /api/InterviewFormDesign/:id
exports.updateInterviewFormDesign = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uinterviewformdesign = await InterviewFormDesign.findByIdAndUpdate(
    id,
    req.body
  );
  if (!uinterviewformdesign) {
    return next(new ErrorHandler("InterviewFormDesign not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete InterviewFormDesign by id => /api/InterviewFormDesign/:id
exports.deleteInterviewFormDesign = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dinterviewformdesign = await InterviewFormDesign.findByIdAndRemove(id);
  if (!dinterviewformdesign) {
    return next(new ErrorHandler("InterviewFormDesign not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete statusallot  => /api/overalldelete/interviewstatusallot
exports.overallDeleteInterviewStatusAllot = catchAsyncErrors(
  async (req, res, next) => {
    const { mode, category, subcategory, question, designation } = req.body;
    let questiongrouping, questionorder;
    function checkPageUsage(questiongrouping, questionorder) {
      let usedPages = "";

      if (questiongrouping || questionorder) {
        if (questiongrouping) usedPages += "Question Grouping, ";
        if (questionorder) usedPages += "Question Order, ";
      }

      return usedPages.trim();
    }

    if (mode === "Typing Test") {
      questiongrouping = await InterviewQuestionGrouping.countDocuments({
        mode: "Typing Test",
        category,
        subcategory,
        designation: { $in: designation },
      });
    } else {
      questiongrouping = await InterviewQuestionGrouping.countDocuments({
        mode: "Questions",
        category,
        subcategory,
        question: { $in: question },
        designation: { $in: designation },
      });
    }
    questionorder = await InterviewQuestionsOrder.countDocuments({
      category,
      subcategory,
      question: { $in: question },
      designation: { $in: designation },
    });

    const usedPages = checkPageUsage(questiongrouping, questionorder);

    if (usedPages) {
      return next(
        new ErrorHandler(`This Data already used in ${usedPages} Pages`, 404)
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete statusallot  => /api/overallbulkdelete/interviewstatusallot
exports.overallBulkDeleteInterviewStatusAllot = catchAsyncErrors(
  async (req, res, next) => {
    let interviewstatusallot, result, count;
    let id = req.body.id;
    try {
      interviewstatusallot = await InterviewFormDesign.find();
      const answer = interviewstatusallot?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      [questiongrouping, statuquestionorder] = await Promise.all([
        InterviewQuestionGrouping.find(),
        InterviewQuestionsOrder.find(),
      ]);

      const unmatchedQuestionGrouping = answer
        .filter((answers) => {
          return questiongrouping.some((sub) => {
            if (answers.mode === "Typing Test") {
              return (
                sub.category === answers.category &&
                sub.subcategory === answers.subcategory &&
                sub.mode === "Typing Test" &&
                answers.designation?.includes(sub?.designation)
              );
            } else {
              return (
                sub.category === answers.category &&
                sub.subcategory === answers.subcategory &&
                sub.mode === "Questions" &&
                sub?.question?.includes(answers?.question) &&
                answers.designation?.includes(sub?.designation)
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
              sub?.question?.includes(answers?.name) &&
              answers.designation?.includes(sub?.designation)
          )
        )
        ?.map((data) => data._id?.toString()); //questions

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

//overall edit answerallot  => /api/overalledit/interviewstatusallot
exports.overallEditInterviewStatusAllot = catchAsyncErrors(
  async (req, res, next) => {
    await Promise.all([
      InterviewQuestionGrouping.updateMany(
        {
          "interviewForm.statusAllotId": {
            $exists: true,
            $eq: req.body.statusAllotId,
          },
        },
        {
          $set: {
            "interviewForm.$[elem].question": req.body.question,
            "interviewForm.$[elem].type": req.body.type,
            "interviewForm.$[elem].optionArr": req.body.optionArr,
            "interviewForm.$[elem].answers": req.body.answers,
            "interviewForm.$[elem].date": req.body.date,
            "interviewForm.$[elem].fromdate": req.body.fromdate,
            "interviewForm.$[elem].todate": req.body.todate,
            "interviewForm.$[elem].datestatus": req.body.datestatus,
            "interviewForm.$[elem].datedescription": req.body.datedescription,
            "interviewForm.$[elem].secondarytodo": req.body.secondarytodo,
            "interviewForm.$[elem].subquestionlength":
              req.body.subquestionlength,
            "interviewForm.$[elem].yesorno": req.body.yesorno,
            "interviewForm.$[elem].statusAns": req.body.statusAns,

            "interviewForm.$[elem].typingspeed": req.body.typingspeed,
            "interviewForm.$[elem].typingspeedvalidation":
              req.body.typingspeedvalidation,
            "interviewForm.$[elem].typingspeedfrom": req.body.typingspeedfrom,
            "interviewForm.$[elem].typingspeedto": req.body.typingspeedto,
            "interviewForm.$[elem].typingspeedstatus":
              req.body.typingspeedstatus,

            "interviewForm.$[elem].typingaccuracy": req.body.typingaccuracy,
            "interviewForm.$[elem].typingaccuracyvalidation":
              req.body.typingaccuracyvalidation,
            "interviewForm.$[elem].typingaccuracyfrom":
              req.body.typingaccuracyfrom,
            "interviewForm.$[elem].typingaccuracyto": req.body.typingaccuracyto,
            "interviewForm.$[elem].typingaccuracystatus":
              req.body.typingaccuracystatus,

            "interviewForm.$[elem].typingmistakes": req.body.typingmistakes,
            "interviewForm.$[elem].typingmistakesvalidation":
              req.body.typingmistakesvalidation,
            "interviewForm.$[elem].typingmistakesfrom":
              req.body.typingmistakesfrom,
            "interviewForm.$[elem].typingmistakesto": req.body.typingmistakesto,
            "interviewForm.$[elem].typingmistakesstatus":
              req.body.typingmistakesstatus,

            "interviewForm.$[elem].typingduration": req.body.typingduration,
          },
        },
        {
          arrayFilters: [{ "elem.statusAllotId": req.body.statusAllotId }],
        }
      ),
      InterviewQuestionsOrder.updateMany(
        {
          "interviewForm.statusAllotId": {
            $exists: true,
            $eq: req.body.statusAllotId,
          },
        },
        {
          $set: {
            "interviewForm.$[elem].question": req.body.question,
            "interviewForm.$[elem].type": req.body.type,
            "interviewForm.$[elem].optionArr": req.body.optionArr,
            "interviewForm.$[elem].answers": req.body.answers,
            "interviewForm.$[elem].date": req.body.date,
            "interviewForm.$[elem].fromdate": req.body.fromdate,
            "interviewForm.$[elem].todate": req.body.todate,
            "interviewForm.$[elem].datestatus": req.body.datestatus,
            "interviewForm.$[elem].datedescription": req.body.datedescription,
            "interviewForm.$[elem].secondarytodo": req.body.secondarytodo,
            "interviewForm.$[elem].subquestionlength":
              req.body.subquestionlength,
            "interviewForm.$[elem].yesorno": req.body.yesorno,
            "interviewForm.$[elem].statusAns": req.body.statusAns,

            "interviewForm.$[elem].typingspeed": req.body.typingspeed,
            "interviewForm.$[elem].typingspeedvalidation":
              req.body.typingspeedvalidation,
            "interviewForm.$[elem].typingspeedfrom": req.body.typingspeedfrom,
            "interviewForm.$[elem].typingspeedto": req.body.typingspeedto,
            "interviewForm.$[elem].typingspeedstatus":
              req.body.typingspeedstatus,

            "interviewForm.$[elem].typingaccuracy": req.body.typingaccuracy,
            "interviewForm.$[elem].typingaccuracyvalidation":
              req.body.typingaccuracyvalidation,
            "interviewForm.$[elem].typingaccuracyfrom":
              req.body.typingaccuracyfrom,
            "interviewForm.$[elem].typingaccuracyto": req.body.typingaccuracyto,
            "interviewForm.$[elem].typingaccuracystatus":
              req.body.typingaccuracystatus,

            "interviewForm.$[elem].typingmistakes": req.body.typingmistakes,
            "interviewForm.$[elem].typingmistakesvalidation":
              req.body.typingmistakesvalidation,
            "interviewForm.$[elem].typingmistakesfrom":
              req.body.typingmistakesfrom,
            "interviewForm.$[elem].typingmistakesto": req.body.typingmistakesto,
            "interviewForm.$[elem].typingmistakesstatus":
              req.body.typingmistakesstatus,

            "interviewForm.$[elem].typingduration": req.body.typingduration,
          },
        },
        {
          arrayFilters: [{ "elem.statusAllotId": req.body.statusAllotId }],
        }
      ),
    ]);

    return res.status(200).json({ updated: true });
  }
);