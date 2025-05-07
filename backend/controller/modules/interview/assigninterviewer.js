const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");
const Assignedinterviewer = require("../../../model/modules/interview/assigninterviewer");
const User = require("../../../model/login/auth");
// get All Holiday => /api/holidays




exports.getAllAssigninterviewerVisitor = catchAsyncErrors(async (req, res, next) => {
  let assigninterview;
  try {


    assigninterview = await Assignedinterviewer.find({
      type: req.body.type,
      fromcompany: req.body.fromcompany, frombranch: req.body.frombranch,

    }, { employee: 1, fromunit: 1 });

  } catch (err) { }
  if (!assigninterview) {
    return next(new ErrorHandler("Assigninterviewer not found!", 404));
  }
  return res.status(200).json({
    assigninterview,
  });
});


exports.getAllAssigninterviewer = catchAsyncErrors(async (req, res, next) => {
  let assigninterview;
  try {
    const { assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      $and: [
        { fromcompany: { $elemMatch: { $eq: branchObj.company } } },
        { frombranch: { $elemMatch: { $eq: branchObj.branch } } },
        { fromunit: { $elemMatch: { $eq: branchObj.unit } } },
      ],
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    assigninterview = await Assignedinterviewer.find(filterQuery);
  } catch (err) { }
  if (!assigninterview) {
    return next(new ErrorHandler("Assigninterviewer not found!", 404));
  }
  return res.status(200).json({
    assigninterview,
  });
});

// Create new Holiday=> /api/powerstation/new
exports.addAssigninterview = catchAsyncErrors(async (req, res, next) => {
  let aproduct = await Assignedinterviewer.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Holiday => /api/powerstation/:id
exports.getSingleAssigninterview = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassigninterviewer = await Assignedinterviewer.findById(id);

  if (!sassigninterviewer) {
    return next(new ErrorHandler("Assigninterviewer not found!", 404));
  }
  return res.status(200).json({
    sassigninterviewer,
  });
});

// update powerashutdown by id => /api/powerstation/:id
exports.updateAssigninterviewer = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uassigninterviewer = await Assignedinterviewer.findByIdAndUpdate(
    id,
    req.body
  );

  if (!uassigninterviewer) {
    return next(new ErrorHandler("Assigninterviewer not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Holiday by id => /api/powerstation/:id
exports.deleteAssigninterviewer = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dassigninterviewer = await Assignedinterviewer.findByIdAndRemove(id);

  if (!dassigninterviewer) {
    return next(new ErrorHandler("Assigninterviewer not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAssignInterviewFilter = catchAsyncErrors(async (req, res, next) => {
  let assigninterview, result, user, userresult;
  let type = req.body.type;
  try {
    result = await Assignedinterviewer.find();
    userresult = await User.find(
      {},
      {
        resonablestatus: 1,
        company: 1,
        branch: 1,
        unit: 1,
        department: 1,
        companyname: 1,
        team: 1,
      }
    );
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && key !== "type") {
        const value = req.body[key];
        if (value !== "ALL" && value !== "") {
          query[key] = value.toString();
        }
      }
    });

    assigninterview =
      type === "Department"
        ? result
          ?.filter((data) => data?.type === "Issuing Authority")
          ?.flatMap((ite) => ite.employee)
        : result
          ?.filter(
            (data) =>
              data?.fromcompany?.includes(query?.company) &&
              data?.type === "Issuing Authority" &&
              data?.frombranch?.includes(query?.branch) &&
              (data?.fromunit?.includes(query?.unit) ||
                query?.unit === undefined) &&
              (data?.fromteam?.includes(query?.team) ||
                query?.team === undefined)
          )
          ?.flatMap((ite) => ite.employee);

    user = userresult?.filter((data) =>
      assigninterview?.includes(data?.companyname)
    );
  } catch (err) { }

  return res.status(200).json({
    user,
  });
});
exports.getAssignInterviewFilterManual = catchAsyncErrors(
  async (req, res, next) => {
    let assigninterview, result, user, userresult;
    try {
      result = await Assignedinterviewer.find();
      userresult = await User.find(
        {},
        {
          resonablestatus: 1,
          company: 1,
          branch: 1,
          unit: 1,
          department: 1,
          companyname: 1,
          team: 1,
        }
      );
      let query = {};
      Object.keys(req.body).forEach((key) => {
        if (key !== "headers" && key !== "type") {
          const value = req.body[key];
          if (value !== "ALL" && value !== "") {
            query[key] = value.toString();
          }
        }
      });

      assigninterview = result
        ?.filter(
          (data) =>
            data?.fromcompany?.includes(query?.company) &&
            data?.type === "Issuing Authority" &&
            data?.frombranch?.includes(query?.branch)
        )
        ?.flatMap((ite) => ite.employee);

      user = userresult?.filter((data) =>
        assigninterview?.includes(data?.companyname)
      );
    } catch (err) { }

    return res.status(200).json({
      user,
    });
  }
);