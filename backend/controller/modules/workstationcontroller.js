const workStation = require("../../model/modules/workstationmodel");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

//get All workStation =>/api/workStation
exports.getAllWorkStation = catchAsyncErrors(async (req, res, next) => {
  let locationgroupings;
  try {
    locationgroupings = await workStation.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!locationgroupings) {
    return next(new ErrorHandler("workStation not found!", 404));
  }
  return res.status(200).json({
    locationgroupings,
  });
});

//create new workStation => /api/workStation/new
exports.addWorkStation = catchAsyncErrors(async (req, res, next) => {
  // let checkloc = await workStation.findOne({ code: req.body.code, });

  // if (checkloc) {
  //     return next(new ErrorHandler('Code already exist!', 400));
  // }
  // let checklocname = await workStation.findOne({ name: req.body.name });

  // if (checklocname) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let alocationgrouping = await workStation.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single workStation => /api/workStation/:id
exports.getSingleWorkStation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let slocationgrouping = await workStation.findById(id);
  if (!slocationgrouping) {
    return next(new ErrorHandler("workStation not found", 404));
  }
  return res.status(200).json({
    slocationgrouping,
  });
});
//update workStation by id => /api/workStation/:id
exports.updateWorkStation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ulocationgrouping = await workStation.findByIdAndUpdate(id, req.body);
  if (!ulocationgrouping) {
    return next(new ErrorHandler("workStation not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete workStation by id => /api/workStation/:id
exports.deleteWorkStation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dlocationgrouping = await workStation.findByIdAndRemove(id);
  if (!dlocationgrouping) {
    return next(new ErrorHandler("workStation not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllWorkStationAccess = catchAsyncErrors(async (req, res, next) => {
  let locationgroupings;
  try {
    const { assignbranch } = req.body;
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    if (branchFilter.length > 0) {
      filterQuery = { $or: branchFilter };
    }

    locationgroupings = await workStation.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!locationgroupings) {
    return next(new ErrorHandler("workStation not found!", 404));
  }
  return res.status(200).json({
    locationgroupings,
  });
});