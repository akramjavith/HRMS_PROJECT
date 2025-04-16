const Interviewroundorder = require("../../../model/modules/interview/interviewroundorder");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const AssignInterviewer = require("../../../model/modules/interview/assigninterviewer");

//get All Interviewroundorder =>/api/interviewroundorders
exports.getAllInterviewroundorder = catchAsyncErrors(async (req, res, next) => {
  let interviewroundorders;
  try {
    interviewroundorders = await Interviewroundorder.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interviewroundorders) {
    return next(new ErrorHandler("Interviewroundorder not found!", 404));
  }
  return res.status(200).json({
    interviewroundorders,
  });
});

//create new Interviewroundorder => /api/Interviewroundorder/new
exports.addInterviewroundorder = catchAsyncErrors(async (req, res, next) => {
  let ainterviewroundorder = await Interviewroundorder.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Interviewroundorder => /api/Interviewroundorder/:id
exports.getSingleInterviewroundorder = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewroundorder = await Interviewroundorder.findById(id);
    if (!sinterviewroundorder) {
      return next(new ErrorHandler("Interviewroundorder not found", 404));
    }
    return res.status(200).json({
      sinterviewroundorder,
    });
  }
);

//update Interviewroundorder by id => /api/Interviewroundorder/:id
exports.updateInterviewroundorder = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uinterviewroundorder = await Interviewroundorder.findByIdAndUpdate(
    id,
    req.body
  );
  if (!uinterviewroundorder) {
    return next(new ErrorHandler("Interviewroundorder not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Interviewroundorder by id => /api/Interviewroundorder/:id
exports.deleteInterviewroundorder = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dinterviewroundorder = await Interviewroundorder.findByIdAndRemove(id);
  if (!dinterviewroundorder) {
    return next(new ErrorHandler("Interviewroundorder not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//overall delete round order  => /api/overalldelete/interviewroundorder
exports.overallDeleteInterviewRoundOrder = catchAsyncErrors(
  async (req, res, next) => {
    const { designation, round } = req.body;
    let assigninterviewer;

    assigninterviewer = await AssignInterviewer.countDocuments({
      round: { $elemMatch: { $in: round } },
      designation,
      type: "Interviewer",
    });

    if (assigninterviewer) {
      return next(
        new ErrorHandler(
          `This Data already used in Assign Interviewer Page`,
          404
        )
      );
    }

    return res.status(200).json({ mayidelete: true });
  }
);

//overall bulk delete round order  => /api/overallbulkdelete/interviewroundorder
exports.overallBulkDeleteInterviewRoundOrder = catchAsyncErrors(
  async (req, res, next) => {
    let roundorder, assigninterviewer, result, count;
    let id = req.body.id;
    try {
      roundorder = await Interviewroundorder.find();
      const answer = roundorder?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      assigninterviewer = await AssignInterviewer.find();

      const unmatchedAssignInterviewer = answer
        .filter((answers) =>
          assigninterviewer.some(
            (sub) =>
              sub.type === "Interviewer" &&
              answers.designation === sub?.designation &&
              answers?.round?.some((data) => sub.round?.includes(data))
          )
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [...unmatchedAssignInterviewer];
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