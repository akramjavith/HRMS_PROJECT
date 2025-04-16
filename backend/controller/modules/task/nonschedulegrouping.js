const TaskNonScheduleGrouping = require("../../../model/modules/task/nonschedulegrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TaskNonScheduleGrouping => /api/tasknonschedulegroupings
exports.getAllTaskNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  let tasknonschedulegrouping;
  try {
    tasknonschedulegrouping = await TaskNonScheduleGrouping.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasknonschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    tasknonschedulegrouping,
  });
});

// Create new TaskNonScheduleGrouping=> /api/tasknonschedulegrouping/new
exports.addTaskNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  let atasknonschedulegrouping = await TaskNonScheduleGrouping.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TaskNonScheduleGrouping => /api/tasknonschedulegrouping/:id
exports.getSingleTaskNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let stasknonschedulegrouping = await TaskNonScheduleGrouping.findById(id);

  if (!stasknonschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    stasknonschedulegrouping,
  });
});

// update TaskNonScheduleGrouping by id => /api/tasknonschedulegrouping/:id
exports.updateTaskNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utasknonschedulegrouping = await TaskNonScheduleGrouping.findByIdAndUpdate(id, req.body);
  if (!utasknonschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TaskNonScheduleGrouping by id => /api/tasknonschedulegrouping/:id
exports.deleteTaskNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtasknonschedulegrouping = await TaskNonScheduleGrouping.findByIdAndRemove(id);

  if (!dtasknonschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
