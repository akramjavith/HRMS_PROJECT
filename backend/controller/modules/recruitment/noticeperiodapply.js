const Noticeperiodapply = require("../../../model/modules/recruitment/noticeperiodapply");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Noticeperiodapply =>/api/Noticeperiodapply
exports.getAllNoticeperiodapply = catchAsyncErrors(async (req, res, next) => {
  let noticeperiodapply, files;
  try {
    // files = await Noticeperiodapply.find({},{files:1})
    noticeperiodapply = await Noticeperiodapply.find(
      {},
      {
        empname: 1,
        empcode: 1,
        reasonleavingname: 1,
        noticedate: 1,
        exitstatus: 1,
        other: 1,
        branch: 1,
        company: 1,
        unit: 1,
        team: 1,
        department: 1,
        status: 1,
        approvedStatus: 1,
        rejectStatus: 1,
        recheckStatus: 1,
        approvenoticereq: 1,
        rejectnoticereq: 1,
        rechecknoticereq: 1,
        requestfile: 1,
        requestdate: 1,
        requestdatestatus: 1,
        approvedthrough: 1,
        cancelreason: 1,
        continuereason: 1,
        cancelstatus: 1,
        continuestatus: 1,
        requestdatereason: 1,
        meetingscheduled: 1,
        username: 1,
        password: 1,
        interviewscheduled: 1,
        date: 1,
        time: 1,
        testname: 1,
        interviewForm: 1,
        confirmationstatus: 1
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!noticeperiodapply) {
    return next(new ErrorHandler("Noticeperiodapply not found!", 404));
  }
  return res.status(200).json({
    noticeperiodapply,
    files,
  });
});

//28.08.2024
exports.getAllNoticeperiodapplyByAssignBranch = catchAsyncErrors(async (req, res, next) => {
  let noticeperiodapply, files;

  const { assignbranch } = req.body;

  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit
    }))
  };
  try {
    // files = await Noticeperiodapply.find({},{files:1})
    noticeperiodapply = await Noticeperiodapply.find(
      query,
      {
        empname: 1,
        empcode: 1,
        reasonleavingname: 1,
        noticedate: 1,
        exitstatus: 1,
        other: 1,
        branch: 1,
        company: 1,
        unit: 1,
        team: 1,
        department: 1,
        status: 1,
        approvedStatus: 1,
        rejectStatus: 1,
        recheckStatus: 1,
        approvenoticereq: 1,
        rejectnoticereq: 1,
        rechecknoticereq: 1,
        requestfile: 1,
        requestdate: 1,
        requestdatestatus: 1,
        approvedthrough: 1,
        cancelreason: 1,
        continuereason: 1,
        cancelstatus: 1,
        continuestatus: 1,
        requestdatereason: 1,
        meetingscheduled: 1,
        username: 1,
        password: 1,
        interviewscheduled: 1,
        date: 1,
        time: 1,
        testname: 1,
        interviewForm: 1,
        confirmationstatus: 1,


        interviewcategory: 1,
        interviewtype: 1,
        venue: 1,
        interviewmode: 1,
        branchvenue: 1,
        floorvenue: 1,
        link: 1,
        date: 1,
        time: 1,
        interviewer: 1,
        updatedby:1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!noticeperiodapply) {
    return next(new ErrorHandler("Noticeperiodapply not found!", 404));
  }
  return res.status(200).json({
    noticeperiodapply,
    files,
  });
});
exports.getAllChecklistNoticeperiodapply = catchAsyncErrors(async (req, res, next) => {
  let noticeperiodapply, files;
  try {
    // files = await Noticeperiodapply.find({},{files:1})
    noticeperiodapply = await Noticeperiodapply.find(
      { approvedStatus: "true", cancelstatus: false, continuestatus: false },
      {
        empname: 1,
        empcode: 1,
        reasonleavingname: 1,
        noticedate: 1,
        exitstatus: 1,
        other: 1,
        branch: 1,
        company: 1,
        unit: 1,
        team: 1,
        department: 1,
        status: 1,
        approvedStatus: 1,
        rejectStatus: 1,
        recheckStatus: 1,
        approvenoticereq: 1,
        rejectnoticereq: 1,
        rechecknoticereq: 1,
        requestfile: 1,
        requestdate: 1,
        requestdatestatus: 1,
        approvedthrough: 1,
        cancelreason: 1,
        continuereason: 1,
        cancelstatus: 1,
        continuestatus: 1,
        requestdatereason: 1,
        meetingscheduled: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!noticeperiodapply) {
    return next(new ErrorHandler("Noticeperiodapply not found!", 404));
  }
  return res.status(200).json({
    noticeperiodapply,
    files,
  });
});
exports.getNoticeperiodapplyForLeave = catchAsyncErrors(async (req, res, next) => {
  let noticeperiodapply, files;
  try {
    // files = await Noticeperiodapply.find({},{files:1})
    noticeperiodapply = await Noticeperiodapply.find(
      { empcode: req.body.empid },
      {
        empname: 1,
        empcode: 1,
        reasonleavingname: 1,
        noticedate: 1,
        other: 1,
        branch: 1,
        company: 1,
        unit: 1,
        team: 1,
        department: 1,
        status: 1,
        approvedStatus: 1,
        rejectStatus: 1,
        recheckStatus: 1,
        approvenoticereq: 1,
        rejectnoticereq: 1,
        rechecknoticereq: 1,
        requestfile: 1,
        requestdate: 1,
        requestdatestatus: 1,
        approvedthrough: 1,
        cancelreason: 1,
        continuereason: 1,
        cancelstatus: 1,
        continuestatus: 1,
        requestdatereason: 1,
        meetingscheduled: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!noticeperiodapply) {
    return next(new ErrorHandler("Noticeperiodapply not found!", 404));
  }

  return res.status(200).json({
    noticeperiodapply,
    files,
  });
});

//create new Noticeperiodapply => /api/Noticeperiodapply/new
exports.addNoticeperiodapply = catchAsyncErrors(async (req, res, next) => {
  let checkmain = await Noticeperiodapply.findOne({
    empcode: req.body.empcode,
    $or: [
      {
        $and: [
          { status: "Applied" },
          { approvedStatus: { $exists: false } },
          { cancelstatus: false },
          { continuestatus: false },
          { rejectStatus: { $exists: false } },
          { recheckStatus: { $exists: false } },
        ]
      },
      {
        $and: [
          { status: "Applied" },
          { approvedStatus: true },
          { cancelstatus: false },
          { continuestatus: false },
          { rejectStatus: { $exists: false } },
          { recheckStatus: { $exists: false } },
        ]
      }
    ]
  });
  if (checkmain) {
    return next(new ErrorHandler('Notice Period Already Applied or Approved!', 400));
  }
  let aNoticeperiodapply = await Noticeperiodapply.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Noticeperiodapply => /api/Noticeperiodapply/:id
exports.getSingleNoticeperiodapply = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let snoticeperiodapply = await Noticeperiodapply.findById(id);
    if (!snoticeperiodapply) {
      return next(new ErrorHandler("Noticeperiodapply not found", 404));
    }
    return res.status(200).json({
      snoticeperiodapply,
    });
  }
);

// //update Noticeperiodapply by id => /api/Noticeperiodapply/:id
// exports.updateNoticeperiodapply = catchAsyncErrors(async (req, res, next) => {
//   console.log(req.body)
//   const id = req.params.id;
//   let unoticeperiodapply = await Noticeperiodapply.findByIdAndUpdate(
//     id,
//     req.body
//   );
//   console.log(unoticeperiodapply)
//   if (!unoticeperiodapply) {
//     return next(new ErrorHandler("Noticeperiodapply not found", 404));
//   }

//   return res.status(200).json({ message: "Updated successfully" });
// });

exports.updateNoticeperiodapply = catchAsyncErrors(async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find and update the document
    let unoticeperiodapply = await Noticeperiodapply.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on the updated document
    });

    // If the document is not found, throw an error
    if (!unoticeperiodapply) {
      return next(new ErrorHandler("Noticeperiodapply not found", 404));
    }

    // Respond with success message
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating Noticeperiodapply:", error);

    // Pass the error to the next middleware (error handler)
    return next(new ErrorHandler(error.message || "An error occurred", 500));
  }
});

//delete Noticeperiodapply by id => /api/Noticeperiodapply/:id
exports.deleteNoticeperiodapply = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dnoticeperiodapply = await Noticeperiodapply.findByIdAndRemove(id);
  if (!dnoticeperiodapply) {
    return next(new ErrorHandler("Noticeperiodapply not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});